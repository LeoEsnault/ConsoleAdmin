## Modèle de données

```mermaid
erDiagram
    PROFILES {
        uuid id PK
        uuid user_id FK
        uuid enterprise_id FK
        string firstname
        string lastname
    }

    APP_ROLE {
        enum role PK
    }

    USER_ROLES {
        uuid id PK
        uuid user_id FK
        app_role role FK
    }

    AUTH {
        uuid id PK
        string email
        datetime last_signed_at
        E.164 phone
    }

    ENTERPRISE {
        uuid id PK
        string name
        datetime created_at
    }

    PROFILES }|--|| AUTH: "has one"
    PROFILES }|--|| ENTERPRISE: "has one"
    USER_ROLES }|--|| AUTH: "assigns roles"
    USER_ROLES }|--|| APP_ROLE : "defines roles"
```
