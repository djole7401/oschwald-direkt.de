<?php

class WC_GZDP_VAT_Validation {
	
	private $api_url = "http://ec.europa.eu/taxation_customs/vies/checkVatService.wsdl";
	private $client = null;
	private $options  = array( 'debug' => false );	
	
	private $valid = false;
	private $data = array();
	
	public function __construct( $options = array() ) {
		
		foreach( $options as $option => $value )
			$this->options[ $option ] = $value;
		
		if ( ! class_exists( 'SoapClient' ) )
			wp_die( __( 'SoapClient is required to enable VAT validation', 'woocommerce-germanized-pro' ) );

		try {
			$this->client = new SoapClient( $this->api_url, array( 'trace' => true ) );
		} catch( Exception $e ) {
			$this->valid = false;
		}

	}

	public function check( $country, $nr ) {

		$rs = null;

		if ( $this->client ) {
            try {
                $rs = $this->client->checkVat( array( 'countryCode' => $country, 'vatNumber' => $nr ) );

                if( $rs->valid ) {
                    $this->valid = true;
                    $this->data = array(
                        'name' 		   => $this->parse_string( $rs->name ),
                        'address'      => $this->parse_string( $rs->address ),
                    );
                } else {
                    $this->valid = false;
                    $this->data = array();
                }

            } catch( SoapFault $e ) {
                $this->valid = false;
                $this->data = array();
            }
        }

    	return apply_filters( 'woocommerce_gzdp_vat_validation_result', $this->valid, $country, $nr );
	}

	public function is_valid() {
		return $this->valid;
	}
	
	public function get_name() {
		return $this->data[ 'name' ];
	}
	
	public function get_address() {
		return $this->data[ 'address' ];
	}
	
	public function is_debug() {
		return ( $this->options[ 'debug' ] === true );
	}

	private function parse_string( $string ) {
    	return ( $string != "---" ? $string : false );
	}
}

?>