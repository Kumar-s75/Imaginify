/** @type {import('next').NextConfig} */

const nextConfig={
    images:{
        remotePatterns:[
            {
                protocols:'https',
                hostname:'res.cloudinary.com',
                port:''
            }
        ]
    }
};

export default nextConfig;