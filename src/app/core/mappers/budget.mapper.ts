import { Budget } from "../../interfaces/budget.interface";

export class BudgetMapper {
  static fromRemote(b:any): Budget {
    return {
      id: b.id,
      clientName: b.client_name,
      clientEmail: b.client_email,
      clientPhone: b.client_phone,
      total: b.total,
      services: b.services,
      date: new Date(b.created_at),
    };
  }

  static toRemote(budget: Budget) {
    return {
      client_name: budget.clientName,
      client_email: budget.clientEmail,
      client_phone: budget.clientPhone,
      total: budget.total,
      services: budget.services,
    };
  }
}
