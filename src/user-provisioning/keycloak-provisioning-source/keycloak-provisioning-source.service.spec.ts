import { Test, TestingModule } from '@nestjs/testing';
import { KeycloakProvisioningSourceService } from './keycloak-provisioning-source.service';

describe('KeycloakProvisioningService', () => {
    let service: KeycloakProvisioningSourceService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                KeycloakProvisioningSourceService,
                {
                    provide: 'KeyCloakSettings',
                    useValue: {
                        realmName: 'master',
                        baseUrl: 'http://localhost:8080/auth',
                        credentials: {
                            grantType: 'password',
                            username: 'admin',
                            password: 'admin',
                            clientId: 'admin-cli',
                        },
                    },
                },
            ],
        }).compile();

        service = module.get<KeycloakProvisioningSourceService>(KeycloakProvisioningSourceService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    it('should synchronize with KeyCloak succesfully', async () => {
        const ret = await service.import();
        expect(ret.length).toBeGreaterThan(0);
        expect(ret.map((e) => e.userName)).toContain('admin');
    });
});
