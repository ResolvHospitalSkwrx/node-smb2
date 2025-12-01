export declare class BigInt {
    buffer: Buffer;
    sign: number;
    constructor(n: number | BigInt, v?: number);
    static isBigInt(v: any): v is BigInt;
    static toBigInt(n: number, v: number): BigInt;
    static fromBuffer(b: Buffer, sign?: number): BigInt;
    add(v: number | BigInt): BigInt;
    neg(): BigInt;
    abs(): BigInt;
    sub(v: number | BigInt): BigInt;
    toBuffer(): Buffer;
    toNumber(): number;
    compare(v: number | BigInt): number;
    lt(v: number | BigInt): boolean;
    le(v: number | BigInt): boolean;
    gt(v: number | BigInt): boolean;
    ge(v: number | BigInt): boolean;
}
export default BigInt;
//# sourceMappingURL=bigint.d.ts.map