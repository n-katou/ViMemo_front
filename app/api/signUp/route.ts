import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/Prisma";
import bcrypt from "bcryptjs";
import { validationRegistSchema } from "@/src/validationSchema";

export async function POST(req: NextRequest) {
  const data = await req.json();
  const { email, password } = data;

  // メールアドレス重複確認とバリデーションを同時に行う
  const [user, validationResult] = await Promise.all([
    prisma.user.findFirst({ where: { email } }),
    validationRegistSchema.safeParseAsync(data)
  ]);

  let errors = validationResult.success ? {} : validationResult.error.flatten().fieldErrors;
  if (user) {
    errors.email = [...(errors.email || []), "このメールアドレスは既に使用されています"];
  }

  if (Object.keys(errors).length > 0) {
    return new NextResponse(JSON.stringify({ errors }), { status: 400 });
  }

  // パスワードをハッシュ化してユーザーを作成
  const hashedPassword = await bcrypt.hash(password, 10);
  await prisma.user.create({
    data: {
      email: email,
      cryptedPassword: hashedPassword,  // 'password' を 'cryptedPassword' に変更
    },
  });

  return new NextResponse(JSON.stringify({ message: "Success" }), { status: 201 });
}