export const asyncHandler = (fn) => {
    return async (req, res, next) => {
        try {
            return await fn(req, res)
        } catch (error) {
            next(error)
        }
    }
}