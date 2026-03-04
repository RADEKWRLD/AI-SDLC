import { z } from "zod/v4";

export const loginSchema = z.object({
  email: z.email("请输入有效的邮箱地址"),
  password: z.string().min(6, "密码至少 6 个字符"),
});

export const registerSchema = z.object({
  name: z.string().min(1, "请输入用户名"),
  email: z.email("请输入有效的邮箱地址"),
  password: z
    .string()
    .min(8, "密码至少 8 个字符")
    .max(100, "密码不能超过 100 个字符")
    .regex(/[a-z]/, "密码需包含小写字母")
    .regex(/[A-Z]/, "密码需包含大写字母")
    .regex(/[0-9]/, "密码需包含数字"),
});

export const createSessionSchema = z.object({
  title: z.string().min(1).max(200),
  description: z.string().max(5000).optional(),
  templateId: z.uuid().optional(),
});

export const updateSessionSchema = z.object({
  title: z.string().min(1, "标题不能为空").max(200).optional(),
  description: z.string().max(5000).optional(),
  status: z.enum(["active", "archived", "completed"]).optional(),
});

export const createDocumentSchema = z.object({
  type: z.enum(["mermaid", "api_spec", "arch_design", "dev_plan", "markdown"]),
  diagramType: z
    .enum(["architecture", "er", "flow", "sequence", "class", "other"])
    .optional(),
  content: z.string(),
  title: z.string().max(200).optional(),
});

export const generateRequestSchema = z.object({
  sessionId: z.uuid(),
  prompt: z.string().min(1).max(10000),
  generateTypes: z
    .array(z.enum(["mermaid", "api_spec", "arch_design", "dev_plan"]))
    .min(1),
  diagramType: z.enum(["architecture", "er", "flow", "sequence"]).optional(),
});

export const sendMessageSchema = z.object({
  content: z.string().min(1).max(10000),
});

export const updateUserMdSchema = z.object({
  userMd: z.string().max(50000),
});
