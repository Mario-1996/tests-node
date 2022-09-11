import { describe, expect, it } from "vitest";
import { Appointment } from "../entities/appointment";
import { getFutureDate } from "../tests/utils/get-future-date";
import { CreateAppointment } from "./create-appointment";
import { InMemoryAppointmentRepository } from '../repositories/in-memory/in-memory-appointments-repository';

describe('Create Appointment', () => {
    it('should be able to create an appointment', () => {
        const appointmentsRepository = new InMemoryAppointmentRepository()
        const createAppointment = new CreateAppointment(appointmentsRepository)

        const startsAt = getFutureDate('2022-09-11')
        const endsAt = getFutureDate('2022-09-12')

        expect(createAppointment.execute({
            customer: 'John Doe',
            startsAt,
            endsAt,
        })).resolves.toBeInstanceOf(Appointment)
    });

    it('should be able to create an appointment with overlapping dates', async () => {
        const appointmentsRepository = new InMemoryAppointmentRepository()
        const createAppointment = new CreateAppointment(appointmentsRepository)

        const startsAt = getFutureDate('2022-09-11')
        const endsAt = getFutureDate('2022-09-16')

        await createAppointment.execute({
            customer: 'John Doe',
            startsAt,
            endsAt,
        })

        expect(createAppointment.execute({
            customer: 'john Doe',
            startsAt: getFutureDate('2022-09-14'),
            endsAt: getFutureDate('2022-09-18'),
        })).rejects.toBeInstanceOf(Error)

        expect(createAppointment.execute({
            customer: 'john Doe',
            startsAt: getFutureDate('2022-09-08'),
            endsAt: getFutureDate('2022-09-12'),
        })).rejects.toBeInstanceOf(Error)

        expect(createAppointment.execute({
            customer: 'john Doe',
            startsAt: getFutureDate('2022-09-08'),
            endsAt: getFutureDate('2022-09-17'),
        })).rejects.toBeInstanceOf(Error)

        expect(createAppointment.execute({
            customer: 'john Doe',
            startsAt: getFutureDate('2022-09-11'),
            endsAt: getFutureDate('2022-09-12'),
        })).rejects.toBeInstanceOf(Error)
    });
})