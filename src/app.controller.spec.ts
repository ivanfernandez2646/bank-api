import { Test, TestingModule } from '@nestjs/testing';
import { createResponse } from 'node-mocks-http';
import { AppController } from './app.controller';
import { AppService } from './app.service';

describe('AppController', () => {
  let appController: AppController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [AppService],
    }).compile();

    appController = app.get<AppController>(AppController);
  });

  describe('root', () => {
    it('should return redirect to /api (swagger)', async () => {
      const res = createResponse();
      appController.redirectToSwagger(res);
      expect(res._getRedirectUrl()).toBe('/api');
    });
  });
});
