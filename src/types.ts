export interface ChatMessage {
  id: string;
  role: "user" | "model";
  text: string;
  timestamp: string;
}

export interface HVACLead {
  id: string;
  name: string;
  company: string;
  email: string;
  phone: string;
  valRange: number;
  missedRate: number;
  potentialLoss: number;
  date: string;
  time: string;
  createdAt: string;
}

export interface CallTriageState {
  callerName: string;
  companyName: string;
  propertyAddress: string;
  equipmentIssue: string;
  urgencyLevel: "emergency" | "routine" | "unknown";
  isCompleted: boolean;
  smsReceiptSimulated: boolean;
  transitTicketGenerated: boolean;
}
