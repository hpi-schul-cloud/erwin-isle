import { HttpModule } from '@nestjs/axios';
import { Test, TestingModule } from '@nestjs/testing';
import { FederalApiProvisioningSource } from './federal-api-provisioning-source.uc';

describe('EducationalProvisioningService', () => {
    let service: FederalApiProvisioningSource;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [FederalApiProvisioningSource],
            imports: [
                HttpModule.register({ baseURL: 'http://localhost:3060/api', timeout: 5000, responseType: 'json' }),
            ],
        }).compile();

        service = module.get<FederalApiProvisioningSource>(FederalApiProvisioningSource);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    it('should load users from federal API', async () => {
        const ret = await service.getUsers();
        console.log(ret);
        expect(ret).toBeTruthy;
    });

    it('should load users from federal API', async () => {
        const ret = await service.getUser('4dfb0d08-5a25-4092-8b5f-bf1e1cadfd70');
        console.log(ret);
        expect(ret).toBeTruthy;
    });

    it('should load users from federal API', async () => {
        const ret = await service.getUserSchools('4dfb0d08-5a25-4092-8b5f-bf1e1cadfd70');
        console.log(ret);
        expect(ret).toBeTruthy;
    });
});
