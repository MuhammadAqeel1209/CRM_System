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
  linkedToContactId: {
    contact: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Contacts', 
    }
  },
    linkedToContractId:{
    contract: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Contracts',
    }
  },
  contactPhase: {
    type: String,
    required: true,
  },
  assignedToUserId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Users', 
    required: true,
  },
});

const ContactData = mongoose.models.ContactData || mongoose.model('ContactData', contactDataSchema);
export default ContactData;
