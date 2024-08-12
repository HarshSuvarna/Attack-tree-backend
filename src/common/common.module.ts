import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthenticationService } from '../authentication/authentication.service';
import { FirebaseService } from '../firebase/firebase.service';
import { NodeService } from '../node/node.service';
import { EdgeSchema } from '../schemas/edgeSchema';
import { NodeSchema } from '../schemas/node.schema';
import { TreeSchema } from '../schemas/tree.schema';
import { UserSchema } from '../schemas/user.schema';
import { TreeService } from '../tree/tree.service';
import { UserService } from '../user/user.service';

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
