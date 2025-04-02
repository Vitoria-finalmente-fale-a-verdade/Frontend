// noinspection StatementWithEmptyBodyJS

export default function getProp(obj: any, prop: string){
  const arr = prop.split(".");
  while(arr.length && (obj = obj[arr.shift() as (typeof obj)]));
  return obj;
}
