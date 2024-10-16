const config = {
  cookieConfig: {
    secret: process.env.JWT_SECRET,
    hook: "onRequest",
    parseOptions: {
      httpOnly: true,
      secure: false,
      sameSite: "Strict"
    }
  },
}

export default config;