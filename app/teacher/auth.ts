import { getChatGPTUser } from "../chatgpt-auth";

// This is the owner verified in the existing Site's access policy.
const teacherEmail = "ellertsmari@gmail.com";

export async function getTeacher() {
  const user = await getChatGPTUser();
  return user?.email.toLowerCase() === teacherEmail ? user : null;
}
