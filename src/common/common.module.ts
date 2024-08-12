import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthenticationService } from 'src/authentication/authentication.service';
import { FirebaseService } from 'src/firebase/firebase.service';
import { NodeService } from 'src/node/node.service';
import { EdgeSchema } from 'src/schemas/edgeSchema';
import { NodeSchema } from 'src/schemas/node.schema';
import { TreeSchema } from 'src/schemas/tree.schema';
import { UserSchema } from 'src/schemas/user.schema';
import { TreeService } from 'src/tree/tree.service';
import { UserService } from 'src/user/user.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'users', schema: UserSchema },
      { name: 'trees', schema: TreeSchema },
      { name: 'nodes', schema: NodeSchema },
      { name: 'edges', schema: EdgeSchema },
    ]),
  ],
  controllers: [],
  providers: [
    UserService,
    TreeService,
    AuthenticationService,
    NodeService,
    FirebaseService,
  ],
  exports: [
    MongooseModule,
    UserService,
    TreeService,
    AuthenticationService,
    NodeService,
    FirebaseService,
  ],
})
export class CommonModule {}
