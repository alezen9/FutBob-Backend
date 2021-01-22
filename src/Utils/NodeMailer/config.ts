type Template = {
   compile: Function
}

type Templates = {
   [field: string]: Template
}

export const Templates: Templates  = Object.freeze({
   CONFIRMATION_CODE: {
      compile: () => {},
      
   }
})