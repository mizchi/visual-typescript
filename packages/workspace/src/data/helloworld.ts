export const helloworld = `
export const str = "string";
export const num = 0;
export const bool = true;
const multilineText = \`
aaa
bbb
ccc
\`;
export default function main(a: string, num: number) {
  console.log("hello", a, num, multilineText);
}
main("xxx", 5);

if (Math.random() > 0.5) {
  alert("hello");
}


`;
