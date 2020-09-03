export class SearchForm {
  // claimNumber: string;
  // claimCategory: string;
  // insuranceType: string;
  // dateFrom: string;
  // dateTo: string;
  // insuredNameKana: string;
  // insuredNameKanji: string;
  // contractorNameKana: string;
  // contractorNameKanji: string;
  // department: string;
  // base: string;

  constructor(private claimNumber: string = '',
    private claimCategory: string = '',
    private insuranceType: string = '',
    private dateFrom: string = '',
    private dateTo: string = '',
    private insuredNameKana: string = '',
    private insuredNameKanji: string = '',
    private contractorNameKana: string = '',
    private contractorNameKanji: string = '',
    private department: string = '',
    private base: string = '') {
    this.claimCategory = claimCategory;
    this.insuranceType = insuranceType;
    this.dateFrom = dateFrom;
    this.dateTo = dateTo;
    this.insuredNameKana = insuredNameKana;
    this.insuredNameKanji = insuredNameKanji;
    this.contractorNameKana = contractorNameKana;
    this.contractorNameKanji = contractorNameKanji;
    this.department = department;
    this.base = base;
  }

}
