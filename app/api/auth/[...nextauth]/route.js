import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import prisma from "@/lib/prisma";
import bcrypt from "bcrypt";

// export const authOptions = {
//     providers: [
       
//         CredentialsProvider({
//             name: "Trainee Login",
//             credentials: {
//                 name: { label: "Name", type: "text" },
//                 phone: { label: "Phone", type: "text" },
//                 age: { label: "Age", type: "number" },
//             },
//             async authorize(credentials) {
//                 const { name, phone, age } = credentials;
//                 if (!name || !phone || !age) return null;

//                 let trainee = await prisma.trainee.findUnique({ where: { phone } });
//                 let isNew = false;

//                 if (!trainee) {
//                     trainee = await prisma.trainee.create({
//                         data: {
//                             name,
//                             phone,
//                             age: parseInt(age),
//                             agreed: true,
//                         },
//                     });
//                     isNew = true;
//                 }

//                 return {
//                     id: trainee.id,
//                     name: trainee.name,
//                     phone: trainee.phone,
//                     age: trainee.age,
//                     role: "trainee",  
//                     isNew,
//                 };
//             },
//         }),

        
//         CredentialsProvider({
//             id: "admin",
//             name: "Admin Login",
//             credentials: {
//                 email: { label: "Email", type: "text" },
//                 password: { label: "Password", type: "password" },
//             },
//             async authorize(credentials) {
//                 const { email, password } = credentials;
//                 if (!email || !password) return null;

//                 const admin = await prisma.user.findUnique({ where: { email } });
//                 if (!admin || admin.role !== "admin") return null;

//                 const match = await bcrypt.compare(password, admin.password);
//                 if (!match) return null;

//                 return {
//                     id: admin.id,
//                     name: admin.name,
//                     email: admin.email,
//                     role: "admin",  
//                 };
//             },
//         }),
//     ],

//     session: {
//         strategy: "jwt",
//     },

//     callbacks: {
//         async jwt({ token, user }) {
//             if (user) {
//                 token.id = user.id;
//                 token.name = user.name;
//                 token.role = user.role; 
//                 token.isNew = user.isNew || false;
//             }
//             return token;
//         },

//         async session({ session, token }) {
//             if (token) {
//                 session.user = {
//                     id: token.id,
//                     name: token.name,
//                     role: token.role,
//                     isNew: token.isNew || false,
//                 };
//             }
//             return session;
//         },
//     },

//     secret: process.env.NEXTAUTH_SECRET,
// };


export const authOptions = {
    providers: [
        CredentialsProvider({
            id: "trainee",
            name: "Trainee Login",
            credentials: {
                name: { label: "Name", type: "text" },
                phone: { label: "Phone", type: "text" },
                age: { label: "Age", type: "number" },
            },
            async authorize(credentials) {
                const { name, phone, age } = credentials;
                if (!name || !phone || !age) return null;

                let trainee = await prisma.trainee.findUnique({ where: { phone } });

                if (!trainee) {
                    trainee = await prisma.trainee.create({
                        data: {
                            name,
                            phone,
                            age: parseInt(age),
                            agreed: true,
                        },
                    });
                }

                return {
                    id: trainee.id,
                    name: trainee.name,
                    role: "trainee",
                };
            },
        }),

        CredentialsProvider({
            id: "admin",
            name: "Admin Login",
            credentials: {
                email: { label: "Email", type: "text" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
                const { email, password } = credentials;
                if (!email || !password) return null;

                const admin = await prisma.user.findUnique({ where: { email } });
                if (!admin || admin.role !== "admin") return null;

                const match = await bcrypt.compare(password, admin.password);
                if (!match) return null;

                return {
                    id: admin.id,
                    name: admin.name,
                    role: "admin",
                };
            },
        }),
    ],

    session: {
        strategy: "jwt",
    },

    pages: {
        signIn: "/admin/login",
    },

    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id;
                token.name = user.name;
                token.role = user.role;
            }
            return token;
        },

        async session({ session, token }) {
            session.user = {
                id: token.id,
                name: token.name,
                role: token.role,
            };
            return session;
        },

        async redirect({ url, baseUrl }) {
            return baseUrl;
        }
    },

    secret: process.env.NEXTAUTH_SECRET,
};



const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
