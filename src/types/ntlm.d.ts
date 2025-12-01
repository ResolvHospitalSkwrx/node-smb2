declare module 'ntlm' {
  export function encodeType1(hostname: string, domain?: string): Buffer;
  export function decodeType2(buffer: Buffer): any;
  export function encodeType3(
    username: string,
    hostname: string,
    domain: string,
    nonce: any,
    password: string
  ): Buffer;
}
