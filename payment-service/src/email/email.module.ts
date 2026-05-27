import { BullModule } from '@nestjs/bullmq';
import { Module } from '@nestjs/common';
import { EmailProcessor } from './processor.worker';

@Module({
    imports : [
        BullModule.registerQueue({
            name : 'email',

        })
    ],
    providers : [EmailProcessor],
    exports : [BullModule],

})
export class EmailModule {}
