from pydantic import BaseModel, Field, EmailStr

class UserSignupSchema(BaseModel):
    firstname: str = Field(..., description="The first name of the user")
    lastname: str = Field(..., description="The last name of the user")
    email: EmailStr = Field(..., description="The email address of the user")
    password: str = Field(..., description="The password of the user")
    onboarded: bool = Field(default=False, description="Whether the user has onboarded")

    class Config:
        json_schema_extra = {
            "example": {
                "firstname": "john",
                "lastname": "doe",
                "email": "john@doe.com",
                "password": "password",
            }
        }

class UserLoginSchema(BaseModel):
    email: EmailStr = Field(..., description="The email address of the user")
    password: str = Field(..., description="The password of the user")

    class Config:
        json_schema_extra = {
            "example": {
                "email": "john@doe.com",
                "password": "password"
            }
        }
