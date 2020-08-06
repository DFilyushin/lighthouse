export interface IOrganization {
    name: string;
    addrReg: string;
    contactEmail: string;
    contactPhone: string;
    contactFax: string;
    reqBank: string;
    reqBin: string;
    reqAccount: string;
    reqBik: string;
    bossName: string;
}

export const nullOrganization =  {
    name: '',
    addrReg: '',
    contactEmail: '',
    contactPhone: '',
    contactFax: '',
    reqBank: '',
    reqBin: '',
    reqAccount: '',
    reqBik: '',
    bossName: ''
};