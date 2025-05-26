import { INestApplication } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

export function setupSwagger(app: INestApplication) {
  const config = new DocumentBuilder()
    .setTitle('Cloudsek Assignment')
    .setDescription(`
    Use the following credentials to test the API:

    - User Login:  
      Email: test@gmail.com  
      Password: 123456

    - Admin Login:  
      Email: admin@gmail.com  
      Password: 123456

    To access authenticated routes:  
    1. Login with the credentials above to get an access token.  
    2. Click the "Authorize" button in Swagger UI.  
    3. Paste the access token into the value field and authorize.

    You will then be able to access protected endpoints.
  `)
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('swagger', app, document);
}
