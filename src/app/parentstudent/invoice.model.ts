export class Invoice {
    constructor(
      public amount: number,
      public amount_paid: number,
      public creation_timestamp: number,
      public due: number,
      public title: string,
      public student_name: string,
      public student_id: number
    ) {}
  }
