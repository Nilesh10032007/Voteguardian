const express = require('express');
const router = express.Router();
const Razorpay = require('razorpay');
const crypto = require('crypto');
const { requireAuth } = require('../middleware/auth');
const PaidEventDetail = require('../models/PaidEventDetail');
const PaidRegistration = require('../models/PaidRegistration');
const Registration = require('../models/Registration');
const Event = require('../models/Event');
const EventSubmission = require('../models/EventSubmission');
const ClubsEvent = require('../models/ClubsEvent');
const User = require('../models/User');
const { transporter } = require('../utils/email');

const razorpay = new Razorpay({
  key_id: (process.env.RAZORPAY_KEY_ID || 'rzp_live_TgFO0VtsCiu9Zq').trim(),
  key_secret: (process.env.RAZORPAY_KEY_SECRET || 'DWN5GuZ3qnbkJbjjS3uMORzx').trim(),
});

const getTicketCategoryCount = async (eventId, categoryKeyword, selectedDate = null) => {
  const catRegex = new RegExp(categoryKeyword, 'i');
  
  const queryConditions = [
    {
      $or: [
        { ticketType: catRegex },
        { selectedTicket: catRegex },
        { 'customAnswers.answer': catRegex },
        { 'teamMembers.customAnswers.answer': catRegex }
      ]
    }
  ];

  if (selectedDate) {
    let dateStr = Array.isArray(selectedDate) ? selectedDate[0] : String(selectedDate);
    dateStr = dateStr.trim();
    if (dateStr) {
      let dateRegex;
      if (dateStr.toLowerCase().includes('30')) {
        dateRegex = /30/i;
      } else if (dateStr.toLowerCase().includes('1')) {
        dateRegex = /1st|1\b|oct/i;
      } else {
        dateRegex = new RegExp(dateStr.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&'), 'i');
      }

      const dateMatchCondition = {
        $or: [
          { customAnswers: { $elemMatch: { question: /date/i, answer: dateRegex } } },
          { 'teamMembers.customAnswers': { $elemMatch: { question: /date/i, answer: dateRegex } } }
        ]
      };
      queryConditions.push(dateMatchCondition);
    }
  }

  const paidCount = await PaidRegistration.countDocuments({
    event: eventId,
    status: 'completed',
    $and: queryConditions
  });

  const freeCount = await Registration.countDocuments({
    event: eventId,
    status: { $ne: 'rejected' },
    $and: queryConditions
  });

  return paidCount + freeCount;
};

// @desc    Create Razorpay Order
// @route   POST /api/payments/create-order
router.post('/create-order', requireAuth, async (req, res) => {
  try {
    const { eventId, eventModel, ticketsCount = 1 } = req.body;

    if (!eventId || !eventModel) {
      return res.status(400).json({ message: 'Missing event information' });
    }

    // 1. Check if user is already registered
    const EventModel = eventModel === 'Event' ? Event : (eventModel === 'ClubsEvent' ? ClubsEvent : EventSubmission);
    let event = await EventModel.findById(eventId);
    if (!event) {
      event = await Event.findById(eventId) || await EventSubmission.findById(eventId) || await ClubsEvent.findById(eventId);
    }
    if (!event) return res.status(404).json({ message: 'Event not found' });

    // Extract date custom answer if present
    const customAnswers = req.body.customAnswers || req.body.teamMembers?.[0]?.customAnswers || [];
    const dateAnsObj = customAnswers.find(a => a.question && a.question.toLowerCase().includes('date'));
    const selectedDate = dateAnsObj ? (Array.isArray(dateAnsObj.answer) ? dateAnsObj.answer[0] : dateAnsObj.answer) : null;

    // Backend validation: Fresher event roll number must start with 26
    if (event.title && event.title.toLowerCase().includes('fresher')) {
      const rollAnsObj = customAnswers.find(a => a.question && a.question.toLowerCase().includes('roll number'));
      if (rollAnsObj && rollAnsObj.answer) {
        const rollStr = String(rollAnsObj.answer).trim();
        if (!rollStr.startsWith('26')) {
          return res.status(400).json({ message: 'Invalid Roll Number: You must be a first-year student.' });
        }
      }
    }

    // Physiofest Special Category Limit Checks (Per day limits)
    const targetCategory = req.body.selectedTicket || req.body.ticketType || req.body.ticketCategory || '';
    const lowerCat = String(targetCategory).toLowerCase();
    const eventIdStr = String(event._id || '');

    const isPhysiofestEvent = ['6ab6af8e184956bd944ba2be', '6ab6b0d1184956bd944ba2bf', '6ab6b159184956bd944ba2c0'].includes(eventIdStr) ||
      (event.title && (event.title.toLowerCase().includes('solo') || event.title.toLowerCase().includes('duet') || event.title.toLowerCase().includes('squad')));

    if (isPhysiofestEvent) {
      let limitConfig = null;

      if (lowerCat.includes('clock') || lowerCat.includes('pushup') || lowerCat.includes('push-up')) {
        limitConfig = { keyword: 'clock|pushup|push-up', name: 'Clock Push-Up', max: 10 };
      } else if (lowerCat.includes('hyfit') || lowerCat.includes('hylift') || lowerCat.includes('high lift') || lowerCat.includes('hy-fit') || lowerCat.includes('hy-lift')) {
        limitConfig = { keyword: 'hyfit|hylift|high lift|hy-fit|hy-lift', name: 'Hyfit', max: 10 };
      } else if (lowerCat.includes('squat') || lowerCat.includes('friends who squat')) {
        limitConfig = { keyword: 'squat|friends who squat', name: 'Friends Who Squat', max: 20 };
      } else if (lowerCat.includes('burpee') || lowerCat.includes('broad jump') || lowerCat.includes('broad trump') || lowerCat.includes('color challenge')) {
        limitConfig = { keyword: 'burpee|broad jump|broad trump|color challenge', name: 'Burpee Color Challenge + Broad Jump Relay', max: 20 };
      } else if (lowerCat.includes('snake') || lowerCat.includes('ladder')) {
        limitConfig = { keyword: 'snake|ladder', name: 'Snake and Ladder', max: 10 };
      }

      if (limitConfig) {
        const categoryCount = await getTicketCategoryCount(event._id, limitConfig.keyword, selectedDate);
        if (categoryCount >= limitConfig.max) {
          return res.status(400).json({
            message: `Registration Full: Maximum limit of ${limitConfig.max} participants for ${limitConfig.name}${selectedDate ? ` on ${selectedDate}` : ''} has been reached.`
          });
        }
      }
    }

    const isAlreadyInRegisteredList = !event.allowMultipleRegistrations && event.registeredUsers?.includes(req.user._id);

    const existingRegistration = !event.allowMultipleRegistrations ? await PaidRegistration.findOne({
      user: req.user._id,
      event: String(eventId),
      status: 'completed'
    }) : null;

    // Check if event is at max capacity
    const freeCount = await Registration.countDocuments({ event: event._id });
    const paidCount = await PaidRegistration.countDocuments({ event: event._id, status: 'completed' });
    const totalCount = Math.max(freeCount + paidCount, event.registeredUsers?.length || 0);

    if (event.capacity && Number(event.capacity) > 0 && totalCount >= Number(event.capacity)) {
      return res.status(400).json({ message: 'Registration Full: This event has reached its maximum participant limit.' });
    }

    if (existingRegistration || isAlreadyInRegisteredList) {
      return res.status(400).json({ message: 'You have already registered for this event' });
    }

    // Server-side validation of team members/participants
    if (req.body.teamMembers && Array.isArray(req.body.teamMembers)) {
      for (let i = 0; i < req.body.teamMembers.length; i++) {
        const m = req.body.teamMembers[i];
        if (m.name) {
          const nameTrimmed = String(m.name).trim();
          if (nameTrimmed.length < 2 || nameTrimmed.length > 60 || !/^[a-zA-Z\s.'-]+$/.test(nameTrimmed)) {
            return res.status(400).json({ message: `Member ${i + 1} Name can only contain letters, spaces, dots, and hyphens (2-60 chars)` });
          }
        }
        if (m.email) {
          const emailTrimmed = String(m.email).trim();
          if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(emailTrimmed)) {
            return res.status(400).json({ message: `Member ${i + 1} Email is invalid` });
          }
        }
        if (m.phone) {
          const phoneDigits = String(m.phone).replace(/\D/g, '');
          const mobile10 = phoneDigits.slice(-10);
          if (phoneDigits.length === 0 || mobile10.length !== 10 || !/^[6-9]\d{9}$/.test(mobile10)) {
            return res.status(400).json({ message: `Member ${i + 1} Phone must be a valid 10-digit mobile number starting with 6, 7, 8, or 9` });
          }
        }
      }
    }

    // Update user's phone number if provided in the registration form
    if (req.body.teamMembers && req.body.teamMembers[0] && req.body.teamMembers[0].phone) {
      await User.findByIdAndUpdate(req.user._id, { phone: req.body.teamMembers[0].phone });
    }

    // 2. Get Event Pricing Details
    const pricing = await PaidEventDetail.findOne({ event: String(eventId) });
    let ticketPrice = pricing?.ticketPrice;
    if (!ticketPrice || isNaN(ticketPrice) || ticketPrice <= 0) {
      if (req.body.unitPrice && !isNaN(req.body.unitPrice) && Number(req.body.unitPrice) > 0) {
        ticketPrice = Number(req.body.unitPrice);
      } else {
        const selectedTicketObj = event.tickets?.find((t) => t.category === targetCategory || t.category?.toLowerCase() === targetCategory.toLowerCase());
        if (selectedTicketObj?.price && !isNaN(selectedTicketObj.price) && Number(selectedTicketObj.price) > 0) {
          ticketPrice = Number(selectedTicketObj.price);
        } else if (event.pricing?.ticketPrice && !isNaN(event.pricing.ticketPrice) && Number(event.pricing.ticketPrice) > 0) {
          ticketPrice = Number(event.pricing.ticketPrice);
        } else if (event.price) {
          const parsed = Number(String(event.price).replace(/[^0-9.]/g, ''));
          if (!isNaN(parsed) && parsed > 0) ticketPrice = parsed;
        }
      }
    }

    if (!ticketPrice || isNaN(ticketPrice) || ticketPrice <= 0) {
      return res.status(400).json({ message: 'Invalid ticket price for this event.' });
    }

    const maxTickets = pricing?.maxTicketsPerUser || 10;
    if (ticketsCount > maxTickets) {
      return res.status(400).json({ message: `You can only purchase up to ${maxTickets} tickets` });
    }

    const amount = Math.round(ticketPrice * ticketsCount * 100); // Amount in paise

    if (amount <= 0) {
      return res.status(400).json({ message: 'Invalid ticket price or count. Amount must be greater than zero.' });
    }

    // 3. Create Razorpay Order
    const options = {
      amount: amount,
      currency: 'INR',
      receipt: `rcpt_${req.user._id.toString().slice(-12)}_${Date.now().toString().slice(-6)}`,
    };

    console.log('Final Order Options:', options);

    let order;
    try {
      order = await razorpay.orders.create(options);
    } catch (rzpErr) {
      console.error('Razorpay SDK Order Creation Failure:', rzpErr);
      const errorMessage = rzpErr.description || rzpErr.message || 'Unknown Razorpay error';
      
      return res.status(502).json({ 
        message: 'Razorpay order creation failed: ' + errorMessage,
        code: rzpErr.code
      });
    }

    // 4. Create a pending registration record
    await PaidRegistration.create({
      user: req.user._id,
      event: eventId,
      eventModel: eventModel,
      razorpayOrderId: order.id,
      amount: ticketPrice * ticketsCount,
      ticketsCount: ticketsCount,
      ticketType: req.body.selectedTicket || req.body.ticketType || '',
      selectedTicket: req.body.selectedTicket || req.body.ticketType || '',
      customAnswers: req.body.customAnswers || [],
      teamSize: req.body.teamSize || 1,
      teamMembers: req.body.teamMembers || [],
      status: 'pending'
    });

    res.json({
        orderId: order.id,
        amount: order.amount,
        currency: order.currency,
        keyId: process.env.RAZORPAY_KEY_ID || 'rzp_live_TgFO0VtsCiu9Zq'
    });

  } catch (error) {
    console.error('General Payment Order Error:', {
      message: error.message,
      stack: error.stack,
      body: req.body,
      userId: req.user?._id
    });
    
    if (error.name === 'CastError') {
      return res.status(400).json({ message: 'Invalid event identifier. This event may no longer exist.' });
    }

    res.status(500).json({ message: 'Error creating payment order: ' + (error.message || 'Unknown error') });
  }
});

// @desc    Verify Razorpay Payment
// @route   POST /api/payments/verify-payment
router.post('/verify-payment', requireAuth, async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      eventId,
      eventModel
    } = req.body;

    // 1. Verify Signature
    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest('hex');

    const isSignatureValid = expectedSignature === razorpay_signature;

    if (!isSignatureValid) {
      return res.status(400).json({ message: 'Invalid payment signature' });
    }

    // 2. Update Registration Status
    const registration = await PaidRegistration.findOne({
      razorpayOrderId: String(razorpay_order_id),
      user: req.user._id
    });

    if (!registration) {
      return res.status(404).json({ message: 'Registration record not found' });
    }

    registration.status = 'completed';
    registration.razorpayPaymentId = razorpay_payment_id;
    registration.razorpaySignature = razorpay_signature;
    await registration.save();

    // 3. Add User to Event's Registered List
    const EventModel = eventModel === 'Event' ? Event : (eventModel === 'ClubsEvent' ? ClubsEvent : EventSubmission);
    let event = await EventModel.findById(eventId);
    if (!event) {
      event = await Event.findById(eventId) || await EventSubmission.findById(eventId) || await ClubsEvent.findById(eventId);
    }

    if (event) {
      if (!event.registeredUsers.includes(req.user._id)) {
        event.registeredUsers.push(req.user._id);
        await event.save();
      }

      // Send ticket email
      if (req.user && req.user.email) {
        try {
          const emailHtml = `
            <div style="font-family: Arial, sans-serif; text-align: center; color: #333; max-width: 500px; margin: 0 auto; border: 1px solid #eaeaea; border-radius: 12px; overflow: hidden;">
              <div style="background-color: #8B5CF6; color: white; padding: 20px;">
                <h1 style="margin: 0; font-size: 24px;">Ticket Confirmed!</h1>
                <p style="margin: 5px 0 0;">${event.title}</p>
              </div>
              <div style="padding: 30px;">
                <p style="font-size: 16px; font-weight: bold;">Hello ${req.user.name || 'User'},</p>
                <p>Your payment of <strong>₹${registration.amount}</strong> was successful!</p>
                <p>Registration for <strong>${event.title}</strong> is confirmed.</p>
                <div style="text-align: left; margin-top: 20px; border-top: 1px dashed #ccc; padding-top: 20px;">
                  <p><strong>Payment ID:</strong> ${razorpay_payment_id}</p>
                  <p><strong>Venue:</strong> ${event.venue || event.location || 'TBA'}</p>
                  <p><strong>Date:</strong> ${event.date || event.startDate || 'TBA'}</p>
                </div>
              </div>
              <div style="background-color: #f3f4f6; padding: 15px; font-size: 12px; color: #6b7280;">
                Powered by Eventum
              </div>
            </div>
          `;

          await transporter.sendMail({
            from: '"Eventum" <' + (process.env.GMAIL_USER || 'findmyevent11@gmail.com') + '>',
            to: req.user.email,
            subject: 'Ticket Confirmed: ' + event.title,
            html: emailHtml
          });
        } catch (emailErr) {
          console.error('Error sending paid ticket email:', emailErr);
        }
      }
    }

    res.json({ message: 'Payment verified and registration successful', registration });

  } catch (error) {
    console.error('Verify Payment Error:', error);
    res.status(500).json({ message: 'Error verifying payment' });
  }
});

module.exports = router;
