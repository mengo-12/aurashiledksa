import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function createAdmin() {
    const hashedPassword = await bcrypt.hash('admin123', 10);

    const admin = await prisma.user.create({
        data: {
            name: 'ali',
            email: 'ali@example.com',
            password: hashedPassword,
            role: 'admin',
        },
    });

    console.log('Admin created:', admin);
}

createAdmin().finally(() => prisma.$disconnect());
