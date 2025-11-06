import { NextRequest, NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'
import { SECURITY_CONFIG, SecurityUtils } from './security-config'

interface AuthenticatedRequest extends NextRequest {
  user?: {
    id: string
    email: string
    isAdmin: boolean
  }
}

interface JWTPayload {
  id: string
  email?: string
  isAdmin?: boolean
  iat: number
  exp: number
  iss?: string // issuer
  aud?: string | string[] // audience
}

// Helper type for handlers with params
type HandlerWithParams = (req: AuthenticatedRequest, context: { params: Promise<{ id: string }> }) => Promise<NextResponse>
// Helper type for handlers without params
type HandlerWithoutParams = (req: AuthenticatedRequest) => Promise<NextResponse>

export function withAuth(handler: HandlerWithoutParams): (req: NextRequest) => Promise<NextResponse>
export function withAuth(handler: HandlerWithParams): (req: NextRequest, context: { params: Promise<{ id: string }> }) => Promise<NextResponse>
export function withAuth(handler: HandlerWithoutParams | HandlerWithParams) {
  // Check if handler expects params by checking its length
  const hasParams = handler.length > 1
  
  if (hasParams) {
    return async (req: NextRequest, context: { params: Promise<{ id: string }> }) => {
    try {
      // Get token from Authorization header
      const authHeader = req.headers.get('Authorization')
      
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return NextResponse.json(
          { 
            error: 'No valid authorization header provided',
            code: 'MISSING_AUTH_HEADER'
          },
          { status: 401 }
        )
      }

      const token = authHeader.replace('Bearer ', '')
      
      // Verify JWT token
      // SECURITY: JWT_SECRET is REQUIRED for production security
      // It's safe to have it here because:
      // 1. Next.js API routes run server-side only (not in browser)
      // 2. process.env variables (without NEXT_PUBLIC_) are never exposed to client
      // 3. We need it to verify tokens before rate limiting and logging
      const jwtSecret = process.env.JWT_SECRET
      if (!jwtSecret) {
        console.error('❌ SECURITY ERROR: JWT_SECRET not found in environment variables')
        console.error('⚠️  JWT_SECRET is REQUIRED for secure token verification')
        console.error('⚠️  Without it, rate limiting and logging are vulnerable to fake tokens')
        return NextResponse.json(
          { 
            error: 'JWT secret not configured',
            code: 'JWT_SECRET_MISSING',
            message: 'Server configuration error. Please contact support.'
          },
          { status: 500 }
        )
      }
      
      if (process.env.NODE_ENV === 'development') {
        console.log('✅ JWT_SECRET found:', jwtSecret.substring(0, 10) + '...')
      }
      let decoded: JWTPayload
      
      try {
        // Try to verify token - first with issuer/audience (how tokens are created)
        try {
          decoded = jwt.verify(token, jwtSecret, {
            issuer: SECURITY_CONFIG.JWT.issuer,
            audience: SECURITY_CONFIG.JWT.audience
          }) as JWTPayload
        } catch (audienceError) {
          // If issuer/audience verification fails, try without for backward compatibility
          try {
          decoded = jwt.verify(token, jwtSecret) as JWTPayload
          } catch (basicError) {
            // If both fail, throw the original error
            throw audienceError
          }
        }
      } catch (jwtError) {
        console.error('JWT verification error:', jwtError)
        
        // For development, try with a fallback JWT secret if the main one fails
        if (process.env.NODE_ENV === 'development') {
          try {
            const fallbackSecret = process.env.JWT_SECRET_FALLBACK || 'default_development_secret_key_for_drinkmate_application_2024'
            console.log('Trying fallback JWT secret for development')
            decoded = jwt.verify(token, fallbackSecret) as JWTPayload
          } catch (fallbackError) {
            console.error('Fallback JWT verification also failed:', fallbackError)
            
            // For development, if all JWT verification fails, try to decode without verification
            // This is a temporary workaround for development environment
            try {
              console.log('Development mode: attempting to decode JWT without verification')
              const decodedUnverified = jwt.decode(token) as JWTPayload
              if (decodedUnverified && decodedUnverified.id) {
                console.log('Development mode: using unverified JWT token')
                decoded = decodedUnverified
              } else {
                throw new Error('Invalid token structure')
              }
            } catch (decodeError) {
              console.error('JWT decode also failed:', decodeError)
              return NextResponse.json(
                { 
                  error: 'Invalid or expired token',
                  code: 'INVALID_TOKEN'
                },
                { status: 401 }
              )
            }
          }
        } else {
          return NextResponse.json(
            { 
              error: 'Invalid or expired token',
              code: 'INVALID_TOKEN'
            },
            { status: 401 }
          )
        }
      }

      // Validate token structure
      if (!decoded.id || !decoded.iat || !decoded.exp) {
        return NextResponse.json(
          { 
            error: 'Invalid token structure',
            code: 'INVALID_TOKEN_STRUCTURE'
          },
          { status: 401 }
        )
      }

      // Check token expiration
      const now = Math.floor(Date.now() / 1000)
      if (decoded.exp < now) {
        return NextResponse.json(
          { 
            error: 'Token has expired',
            code: 'TOKEN_EXPIRED'
          },
          { status: 401 }
        )
      }

      // Security check: Reject demo accounts in production
      if (process.env.NODE_ENV === 'production' && decoded.id.toString().startsWith('demo')) {
        return NextResponse.json(
          { 
            error: 'Demo accounts not allowed in production',
            code: 'DEMO_ACCOUNT_BLOCKED'
          },
          { status: 401 }
        )
      }

      // Add user info to request
      const authenticatedReq = req as AuthenticatedRequest
      authenticatedReq.user = {
        id: decoded.id,
        email: decoded.email || '',
        isAdmin: decoded.isAdmin || false
      }

      // Call the original handler with params
      return await (handler as HandlerWithParams)(authenticatedReq, context)

    } catch (error) {
      console.error('Auth middleware error:', error)
      return NextResponse.json(
        { 
          error: 'Authentication failed',
          code: 'AUTH_ERROR'
        },
        { status: 500 }
      )
    }
  }
  } else {
    // Handler without params
    return async (req: NextRequest) => {
      try {
        // Get token from Authorization header
        const authHeader = req.headers.get('Authorization')
        
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
          return NextResponse.json(
            { 
              error: 'No valid authorization header provided',
              code: 'MISSING_AUTH_HEADER'
            },
            { status: 401 }
          )
        }

        const token = authHeader.replace('Bearer ', '')
        
        // Verify JWT token
        // SECURITY: JWT_SECRET is REQUIRED for production security
        // It's safe to have it here because:
        // 1. Next.js API routes run server-side only (not in browser)
        // 2. process.env variables (without NEXT_PUBLIC_) are never exposed to client
        // 3. We need it to verify tokens before rate limiting and logging
        const jwtSecret = process.env.JWT_SECRET
        if (!jwtSecret) {
          console.error('❌ SECURITY ERROR: JWT_SECRET not found in environment variables')
          console.error('⚠️  JWT_SECRET is REQUIRED for secure token verification')
          console.error('⚠️  Without it, rate limiting and logging are vulnerable to fake tokens')
          return NextResponse.json(
            { 
              error: 'JWT secret not configured',
              code: 'JWT_SECRET_MISSING',
              message: 'Server configuration error. Please contact support.'
            },
            { status: 500 }
          )
        }
        
        if (process.env.NODE_ENV === 'development') {
          console.log('✅ JWT_SECRET found:', jwtSecret.substring(0, 10) + '...')
        }
        let decoded: JWTPayload
        
        try {
          // Try to verify token - first with issuer/audience (how tokens are created)
          try {
            decoded = jwt.verify(token, jwtSecret, {
              issuer: SECURITY_CONFIG.JWT.issuer,
              audience: SECURITY_CONFIG.JWT.audience
            }) as JWTPayload
          } catch (audienceError) {
            // If issuer/audience verification fails, try without for backward compatibility
            try {
            decoded = jwt.verify(token, jwtSecret) as JWTPayload
            } catch (basicError) {
              // If both fail, throw the original error
              throw audienceError
            }
          }
        } catch (jwtError: any) {
          console.error('JWT verification error:', {
            message: jwtError?.message,
            name: jwtError?.name,
            tokenPreview: token?.substring(0, 20) + '...',
            secretLength: jwtSecret?.length
          })
          
          // For development, try with a fallback JWT secret if the main one fails
          if (process.env.NODE_ENV === 'development') {
            try {
              const fallbackSecret = process.env.JWT_SECRET_FALLBACK || 'default_development_secret_key_for_drinkmate_application_2024'
              console.log('Trying fallback JWT secret for development')
              decoded = jwt.verify(token, fallbackSecret) as JWTPayload
            } catch (fallbackError) {
              console.error('Fallback JWT verification also failed:', fallbackError)
              
              // For development, if all JWT verification fails, try to decode without verification
              // This is a temporary workaround for development environment
              try {
                console.log('Development mode: attempting to decode JWT without verification')
                const decodedUnverified = jwt.decode(token) as JWTPayload
                if (decodedUnverified && decodedUnverified.id) {
                  console.log('Development mode: using unverified JWT token')
                  decoded = decodedUnverified
                } else {
                  throw new Error('Invalid token structure')
                }
              } catch (decodeError) {
                console.error('JWT decode also failed:', decodeError)
                return NextResponse.json(
                  { 
                    error: 'Invalid or expired token',
                    code: 'INVALID_TOKEN'
                  },
                  { status: 401 }
                )
              }
            }
          } else {
            // In production, provide more helpful error message
            const errorDetails: any = {
                error: 'Invalid or expired token',
                code: 'INVALID_TOKEN'
            }
            
            // Try to decode token to provide more info (without verification)
            try {
              const decodedUnverified = jwt.decode(token) as JWTPayload
              if (decodedUnverified) {
                errorDetails.details = {
                  tokenHasId: !!decodedUnverified.id,
                  tokenExpired: decodedUnverified.exp ? decodedUnverified.exp < Math.floor(Date.now() / 1000) : 'unknown',
                  tokenIssuer: decodedUnverified.iss || 'none',
                  tokenAudience: decodedUnverified.aud || 'none'
                }
                console.error('🔍 Token decode info (unverified):', errorDetails.details)
              }
            } catch (decodeError) {
              console.error('🔍 Could not decode token:', decodeError)
            }
            
            console.error('🔍 JWT verification failed in production:', {
              errorMessage: jwtError?.message,
              errorName: jwtError?.name,
              secretConfigured: !!jwtSecret,
              secretLength: jwtSecret?.length
            })
            
            return NextResponse.json(errorDetails, { status: 401 })
          }
        }

        // Validate token structure
        if (!decoded.id || !decoded.iat || !decoded.exp) {
          return NextResponse.json(
            { 
              error: 'Invalid token structure',
              code: 'INVALID_TOKEN_STRUCTURE'
            },
            { status: 401 }
          )
        }

        // Check token expiration (allow 5 minute grace period for clock skew)
        const now = Math.floor(Date.now() / 1000)
        const gracePeriod = 300 // 5 minutes
        if (decoded.exp < (now - gracePeriod)) {
          return NextResponse.json(
            { 
              error: 'Token has expired. Please log in again.',
              code: 'TOKEN_EXPIRED'
            },
            { status: 401 }
          )
        }

        // Security check: Reject demo accounts in production
        if (process.env.NODE_ENV === 'production' && decoded.id.toString().startsWith('demo')) {
          return NextResponse.json(
            { 
              error: 'Demo accounts not allowed in production',
              code: 'DEMO_ACCOUNT_BLOCKED'
            },
            { status: 401 }
          )
        }

        // Add user info to request
        const authenticatedReq = req as AuthenticatedRequest
        authenticatedReq.user = {
          id: decoded.id,
          email: decoded.email || '',
          isAdmin: decoded.isAdmin || false
        }

        console.log('✅ Auth middleware: Token verified successfully', {
          userId: decoded.id,
          hasEmail: !!decoded.email,
          isAdmin: decoded.isAdmin
        })

        // Call the original handler without params
        return await (handler as HandlerWithoutParams)(authenticatedReq)

      } catch (error) {
        console.error('Auth middleware error:', error)
        return NextResponse.json(
          { 
            error: 'Authentication failed',
            code: 'AUTH_ERROR'
          },
          { status: 500 }
        )
      }
    }
  }
}

export function withAdminAuth(handler: (req: AuthenticatedRequest) => Promise<NextResponse>) {
  return withAuth(async (req: AuthenticatedRequest) => {
    // Check if user is admin
    if (!req.user?.isAdmin) {
      return NextResponse.json(
        { 
          error: 'Admin access required',
          code: 'ADMIN_REQUIRED'
        },
        { status: 403 }
      )
    }

    return await handler(req)
  })
}
