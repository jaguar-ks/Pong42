import {z} from "zod";

export const schema = z.object({
    firstname: z.string()
    .min(1, {message: "need more than 6 characters"}),
    lastname: z.string()
    .min(1, {message: "need more than 6 characters"}),
    email: z.string()
    .min(1, {message: "need more than 6 characters"}),
    username: z.string()
    .min(1, {message: "need more than 6 characters"}),
    password: z.string()
    .min(1, {message: "need more than 6 characters"}),
    confermPassword: z.string()
    .min(1, {message: "password need to be more than  6 characters"}),
});