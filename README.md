# PC Shop Monolith + Payment Microservice

## Overview

This project is a backend-focused e-commerce architecture built with:

* NestJS
* PostgreSQL
* Prisma ORM
* Redis
* BullMQ
* Stripe
* Docker
* Nodemailer

The system is separated into:

1. **PC Shop Monolith**

   * Main business application
   * Products
   * Orders
   * Users
   * Authentication
   * Communication with payment service

2. **Payment Microservice**

   * Stripe integration
   * Webhook processing
   * Payment status handling
   * Redis queue processing
   * Email notifications

---

# Architecture

```txt
Frontend
   |
   v
PC Shop Monolith
   |
   | TCP / MessagePattern
   v
Payment Microservice
   |
   v
Stripe
   |
   v
Stripe Webhook
   |
   v
Payment Microservice
   |
   +--> PostgreSQL update
   |
   +--> Redis Queue (BullMQ)
             |
             v
        Email Worker
             |
             v
        Nodemailer
```

---

# Features

## PC Shop Monolith

* Product management
* User management
* Order creation
* Authentication & authorization
* Redis caching
* Communication with payment microservice
* Dockerized environment

## Payment Microservice

* Stripe Checkout integration
* Stripe webhook verification
* Payment status synchronization
* BullMQ background jobs
* Redis queue processing
* Payment confirmation emails
* Async email handling
* Retry-ready architecture

---

# Tech Stack

## Backend

* NestJS
* TypeScript
* Prisma ORM
* PostgreSQL
* Redis
* BullMQ
* Stripe SDK
* Nodemailer

## Infrastructure

* Docker
* Docker Compose

---

# Redis Usage

Redis is used for:

## 1. Cache Layer

Used to cache frequently accessed data:

* Payment status
* Product data
* Read-heavy endpoints

Example:

```ts
@UseInterceptors(CacheInterceptor)
@CacheTTL(10)
@Get('status/:id')
```

---

## 2. Queue System (BullMQ)

Used for:

* Background email processing
* Async tasks
* Retry logic
* Reliable event processing

Example flow:

```txt
Webhook
   ↓
Queue.add()
   ↓
Redis Queue
   ↓
Worker/Processor
   ↓
Send Email
```

---

# Stripe Flow

## Payment Processing Flow

```txt
Frontend
   ↓
Backend API
   ↓
Payment Microservice
   ↓
Stripe Checkout Session
   ↓
Frontend Redirect to Stripe
   ↓
Stripe Webhook
   ↓
Database Update
   ↓
BullMQ Email Queue
   ↓
Worker Sends Email
```

---

# BullMQ Workflow

## Queue Producer

Webhook service adds email jobs:

```ts
await this.emailQueue.add('send_email', {
  email: session.customer_details?.email,
  subject: 'Payment Confirmation',
  text: 'Your Payment was successful',
});
```

---

## Processor / Worker

```ts
@Processor('email')
export class EmailProcessor extends WorkerHost {

  async process(job: Job<any>): Promise<any> {

    if (job.name === 'send_email') {
      // email logic
    }
  }
}
```

---

# Docker

The project is fully Dockerized.

Services include:

* PostgreSQL
* Redis
* Backend services

Benefits:

* Consistent environments
* Easier deployment
* Dependency isolation
* Reproducible setup

---

# Environment Variables

## Payment Microservice

```env
DATABASE_URL=
REDIS_HOST=
REDIS_PORT=
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
EMAIL_USER=
EMAIL_PASS=
```

---

# API Endpoints

## Payment Status

```http
GET /status/:id
```

Returns payment status from database.

Database is used as the source of truth.

---

## Stripe Webhook

```http
POST /payments/webhook
```

Handles:

* checkout.session.completed
* checkout.session.expired

---

# Project Goals

This project was built to practice:

* Backend architecture
* Async processing
* Redis caching
* Queue systems
* Stripe integration
* Webhook handling
* Dockerized development
* Microservice communication
* Production-style backend patterns

---

# Future Improvements

* Role-based authorization
* Email templates
* Retry/backoff customization
* Bull Board dashboard
* CI/CD pipeline
* Rate limiting
* Monitoring & logging
* File upload system
* Advanced caching strategies
* Order invoice generation

---

# Author

Danijel Gajic

GitHub: [https://github.com/danijel01](https://github.com/danijel01)
