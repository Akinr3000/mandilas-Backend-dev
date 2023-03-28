const Forms = require("../model/sellers-val");
const nodemailer = require("nodemailer");
const DB = require("../model/");
const { ErrorResponse, showError } = require("../utils/");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.gmail,
    pass: process.env.gmailPassword,
  },
});

exports.getadmin = async (req, res) => {
  try {
    const unapprovedForms = await Forms.find({ approved: false }).select(
      "storename business address approved"
    );
    // console.log(form);

    if (!unapprovedForms)
      throw ErrorResponse(
        "no current unapproved Form, all tendered requests verified",
        409
      );

    res.status(200).json({
      success: true,
      unapprovedForms,
    });
  } catch (error) {
    const message = error.message || "Internal Server error";
    const cs = error.statusCode || 500;
    res.status(cs).json(showError(message, cs));
  }
};

exports.postadmin = async (req, res) => {
  const { storename, approved } = req.body;

  if (!storename) {
    res
      .status(401)
      .json(
        showError(
          "invalid request please check request body the approved field properly"
        ),
        401
      );
  }
  if (approved === undefined || null) {
    res
      .status(401)
      .json(
        showError(
          "invalid request please check request body the approved field properly"
        ),
        401
      );
  }

  try {
    const forms = await Forms.findOne({ storename });

    if (!forms) throw ErrorResponse("Store with this name does not exist", 409);

    const userId = forms.user;
    const user = await DB.User.findById(userId);
    if (!user) throw new ErrorResponse("User does not exist", 409);

    if (approved === true) {
      forms.approved = approved;
      await forms.save();

      const mailoptionSuccess = {
        from: process.env.gmail,
        to: user.email,
        subject: "your form has been approved",
        text: `Dear  ${user.firstName} 
          We are pleased to inform you that your form has been approved.
          Thank you for your submission.
          Best regards Admin`,
      };

      transporter.sendMail(mailoptionSuccess, (err, info) => {
        if (err) {
          console.log(err);
        } else {
          console.log("email sent: " + info.response);
        }
      });
    } else {
      const mailoptionDenied = {
        from: process.env.gmail,
        to: user.email,
        subject: "your form has been declined",
        text: `Dear  ${user.firstName} 
        We are sad to inform you that your form has been declined for certain reasons.
        Thank you for your submission.
        Best regards Admin`,
      };

      transporter.sendMail(mailoptionDenied, (err, info) => {
        if (err) {
          console.log(err);
        } else {
          console.log("email sent: " + info.response);
        }
      });
    }

    res.status(200).json({
      success: true,
      adminApproved: approved,
      message: "Email sent successfully",
    });
  } catch (error) {
    const cs = error.statusCode || 500;
    const message = error.message || "Internal Server Error";
    return res.status(cs).json(showError(message, cs));
  }
};
