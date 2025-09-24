import 'reflect-metadata'
import {
  Field,
  HideField,
  ObjectType,
  registerEnumType,
} from '@nestjs/graphql'
import { IsEmail } from 'class-validator'
import { Post } from '@/posts/models/post.model'
import { BaseModel } from '@/common/models/base.model'
import { Role } from '@prisma/client'

registerEnumType(Role, {
  name: 'Role',
  description: 'User role',
})

@ObjectType()
export class User extends BaseModel {
  @Field()
  @IsEmail()
  email: string

  @Field(() => String, { nullable: true })
  firstname?: string

  @Field(() => String, { nullable: true })
  lastname?: string

  @Field(() => Role)
  role: Role

  @Field(() => [Post], { nullable: true })
  posts?: [Post] | null

  @HideField()
  password: string
}
