import mongoose from 'mongoose';

const contactDataSchema = new mongoose.Schema({
  createdOn: {
    type: Date,
    default: Date.now,
  },
  title: {
    type: String,
    required: true,
  },
  linkedTo: {
    contact: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Contacts', 
    },
    contract: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Contracts',
    },
  },
  contactPhase: {
    type: String,
    required: true,
  },
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Users', 
    required: true,
  },
});

const ContactData = mongoose.models.ContactData || mongoose.model('ContactData', contactDataSchema);
export default ContactData;
