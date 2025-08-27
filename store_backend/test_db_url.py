import dj_database_url
import os

# Тестовий URL (візьми свій із Render, External)
url = "postgresql://products_hsj5_user:j7WxMJhcqWG2fWEJIq4bTCl9CHUjlnVk@dpg-d2lc0sbe5dus738lfd70-a.frankfurt-postgres.render.com/products_hsj5"

db_config = dj_database_url.parse(url)

print("Parsed config:")
print(db_config)
