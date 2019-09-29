Для запуска проекта:

```bash
nvm user

npm i

node app.js [directory]
```

directory — путь до директории с репозиториями, по умолчанию берется текущая

Формат запроса для пагинации:
api/repos/:repositoryId/commits/:commitHash?page=1


### Redux

Для поиска по файлам был замокан запрос эндпоинт `/api/repos/:repositoryId/tree`

Логика лежит в папке client/scripts
