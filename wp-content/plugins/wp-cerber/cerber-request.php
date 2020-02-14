<?php

final class CRB_Request {
	private static $remote_ip = null;
	private static $clean_uri = null; // No trailing slash, GET parameters and other junk symbols
	private static $uri_script = null; // With path and the starting slash (if script)
	private static $site_root = null; // Without trailing slash and path (site domain or IP address)
	private static $sub_folder = null; // Without trailing slash and site domain

	static function URI() {
		if ( isset( self::$clean_uri ) ) {
			return self::$clean_uri;
		}

		return self::purify();
	}

	// Clean up the requested URI from GET parameters and extra slashes
	// @since 7.9.2
	static function purify() {
		$uri = $_SERVER['REQUEST_URI'];

		if ( $pos = strpos( $uri, '?' ) ) {
			$uri = substr( $uri, 0, $pos );
		}

		if ( $pos = strpos( $uri, '#' ) ) {
			$uri = substr( $uri, 0, $pos );
		}

		$uri             = rtrim( $uri, '/' );
		self::$clean_uri = preg_replace( '/\/+/', '/', $uri );

		return self::$clean_uri;
	}

	static function parse_site_url() {

		if ( isset( self::$site_root ) ) {
			return;
		}

		$site_url = cerber_get_site_url(); // Including the path to WP files and stuff
		$p1       = strpos( $site_url, '//' );
		$p2       = strpos( $site_url, '/', $p1 + 2 );
		if ( $p2 !== false ) {
			self::$site_root  = substr( $site_url, 0, $p2 );
			self::$sub_folder = substr( $site_url, $p2 );
		}
		else {
			self::$site_root  = $site_url;
			self::$sub_folder = '';
		}

	}

	/**
	 * Requested URL as is
	 *
	 * @return string
	 */
	static function full_url() {

		self::parse_site_url();

		return self::$site_root . $_SERVER['REQUEST_URI'];

	}

	static function full_url_clean() {

		self::parse_site_url();

		return self::$site_root . self::URI();

	}

	/**
	 * Does requested URL start with a given string
	 *
	 * @return string
	 */
	static function is_url_start_with( $str ) {

		if ( substr( $str, - 1, 1 ) == '/' ) {
			$url = rtrim( self::full_url_clean(), '/' ) . '/';
		}
		else {
			$url = self::full_url_clean();
		}

		if ( 0 === strpos( $url, $str ) ) {
			return true;
		}

		return false;
	}

	static function is_url_equal( $str ) {

		if ( substr( $str, - 1, 1 ) == '/' ) {
			$url = rtrim( self::full_url_clean(), '/' ) . '/';
		}
		else {
			$url = self::full_url_clean();
		}

		if ($url == $str ) {
			return true;
		}

		return false;
	}

	static function script() {

		if ( isset( self::$uri_script ) ) {
			return self::$uri_script;
		}

		if ( cerber_detect_exec_extension( self::URI() ) ) {
			self::$uri_script = strtolower( self::URI() );
		}
		else {
			self::$uri_script = false;
		}

		return self::$uri_script;
	}

	// @since 7.9.2
	static function is_script( $val ) {
		if ( ! self::script() ) {
			return false;
		}
		$uri_script = self::$uri_script;
		self::parse_site_url();
		if ( self::$sub_folder ) {
			$uri_script = substr( self::$uri_script, strlen( self::$sub_folder ) );
		}

		if ( is_array( $val ) ) {
			if ( in_array( $uri_script, $val ) ) {
				return true;
			}
		}
		elseif ( $uri_script == $val ) {
			return true;
		}

		return false;
	}
}