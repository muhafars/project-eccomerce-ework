const { subject } = require("@casl/ability");
const Invoice = require("./model");
const { policyFor } = require("../../utils");

const show = async function (req, res, next) {
  try {
    const { order_id } = req.params;
    const invoice = await Invoice.find({ order: order_id }).populate("order").populate("user");
    const policy = policyFor(req.user);
    const subjectInvoice = subject("Invoice", { ...invoice, user: invoice.user._id });
    if (!policy.can("read", subjectInvoice)) {
      return res.json({
        error: 1,
        message: "Anda tidak memiliki akses untuk melihat invoice ini",
      });
    }

    return res.json(invoice);
  } catch (err) {
    res.json({
      error: 1,
      message: "Error When Getting Invoice",
    });
  }
};

module.export = { show };
