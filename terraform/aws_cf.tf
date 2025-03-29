locals {
  s3_origin_id = "S3-${aws_s3_bucket.spa_bucket.id}"
}

resource "aws_cloudfront_origin_access_control" "spa" {
  name                              = "spa-oac-${terraform.workspace}"
  description                       = "OAC for Url Shortener SPA"
  origin_access_control_origin_type = "s3"
  signing_behavior                  = "always"
  signing_protocol                  = "sigv4"
}

resource "aws_cloudfront_distribution" "spa_cdn" {
  origin {
    domain_name              = aws_s3_bucket.spa_bucket.bucket_regional_domain_name
    origin_access_control_id = aws_cloudfront_origin_access_control.spa.id
    origin_id                = local.s3_origin_id
  }

  aliases = terraform.workspace == "production" ? [var.domain] : ["staging.${var.domain}"]

  enabled             = true
  is_ipv6_enabled     = true
  default_root_object = "index.html"

  default_cache_behavior {
    allowed_methods  = ["GET", "HEAD"]
    cached_methods   = ["GET", "HEAD"]
    target_origin_id = local.s3_origin_id

    min_ttl     = 0
    default_ttl = 2592000
    max_ttl     = 31536000

    forwarded_values {
      query_string = true

      cookies {
        forward = "none"
      }
    }

    viewer_protocol_policy = "redirect-to-https"
  }

  ordered_cache_behavior {
    path_pattern               = "/index.html"
    allowed_methods            = ["GET", "HEAD"]
    cached_methods             = ["GET", "HEAD"]
    target_origin_id           = local.s3_origin_id
    response_headers_policy_id = aws_cloudfront_response_headers_policy.security_headers_policy.id

    forwarded_values {
      query_string = true
      cookies {
        forward = "none"
      }
    }

    viewer_protocol_policy = "redirect-to-https"

    min_ttl     = 0
    default_ttl = 0
    max_ttl     = 0
  }

  custom_error_response {
    error_caching_min_ttl = 0
    error_code            = 403
    response_code         = 200
    response_page_path    = "/index.html"
  }

  custom_error_response {
    error_caching_min_ttl = 0
    error_code            = 404
    response_code         = 200
    response_page_path    = "/index.html"
  }

  price_class = "PriceClass_100"

  restrictions {
    geo_restriction {
      restriction_type = "none"
    }
  }

  viewer_certificate {
    acm_certificate_arn            = aws_acm_certificate.cert.arn
    ssl_support_method             = "sni-only"
    minimum_protocol_version       = "TLSv1.2_2019"
    cloudfront_default_certificate = false
  }
}

resource "aws_cloudfront_response_headers_policy" "security_headers_policy" {
  name = "security-headers-policy"
  security_headers_config {
    content_type_options {
      override = true
    }
    frame_options {
      frame_option = "DENY"
      override     = true
    }
    referrer_policy {
      referrer_policy = "same-origin"
      override        = true
    }
    xss_protection {
      mode_block = true
      protection = true
      override   = true
    }
    strict_transport_security {
      access_control_max_age_sec = "31536000"
      include_subdomains         = true
      preload                    = true
      override                   = true
    }
    content_security_policy {
      content_security_policy = "default-src *.url.shortener; frame-ancestors 'none'; frame-src *.url.shortener ; img-src 'self'; script-src 'self' 'unsafe-eval' *.sentry.io; connect-src *.url.shortener wss://*.url.shortener *.sentry.io; style-src 'self' 'unsafe-inline'; manifest-src 'self'; font-src 'self' *.url.shortener fonts.googleapis.com fonts.gstatic.com; style-src-elem *.url.shortener fonts.googleapis.com 'unsafe-inline' 'self'; worker-src 'self' blob:; object-src 'none'"
      override                = true
    }
  }
}
