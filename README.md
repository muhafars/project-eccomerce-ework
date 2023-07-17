# Backend Process
## Structuring Folder
* app
*		auth
*			controller.js
*			router.js
*		category
*			controller.js
*			model.js
*			router.js
*		product
*			controller.js
*			model.js
*			router.js
*		tag
*			controller.js
*			model.js
*			router.js
*		user
*			model.js
*		config.js
* bin
* database
* node_modules
* public
* views
* .env
* .gitignore
* app.js
* package.json
## Dependencies NPM
* express js
* multer
* cors
* mongoose
* morgan
* dotenv
* bcrypt
* passport
* passport-local
* jsonwebtoken
* CASL
> casl as policies digunakan untuk memberikan hak akses crud sesuai roles diantaranya diperlukan beberapa middlewares tambahan dan utils function
1. policies_check @middlewares folder
2. varibale const policies untuk declaration roles
3. policyFor function sebagai controller const policies & menghubungkan utils policies_check
