import { Test, TestingModule } from '@nestjs/testing';
import { KeycloakProvisioningSourceUc } from './keycloak-provisioning-source.uc';

describe('KeycloakProvisioningService', () => {
    let service: KeycloakProvisioningSourceUc;

    beforeEach(async () => {
        const testingModule: TestingModule = await Test.createTestingModule({
            providers: [
                KeycloakProvisioningSourceUc,
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

        service = testingModule.get<KeycloakProvisioningSourceUc>(KeycloakProvisioningSourceUc);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    it('should synchronize with KeyCloak successfully', async () => {
        const ret = await service.import();

        expect(ret.length).toBeGreaterThan(0);
        expect(ret.map((e) => e.userName)).toContain('admin');
    });
});
