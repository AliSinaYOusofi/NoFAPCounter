// pages/api/submit.js
export async function POST(req, res) {
    try {
        const res = await req.json()
        
        const response = new Response(
            JSON.stringify( {success: true }),
            {
                status: 200,
                headers: {
                    "Content-Type": "application/json"
                }
            }
        )

        return response
    } catch (error) {
        
        return Response.json({something: "happened"})
    }   
}