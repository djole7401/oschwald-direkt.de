<?php

if ( ! defined( 'ABSPATH' ) )
	exit;

if ( ! class_exists( 'TCPDF' ) ) {
    include_once( WC_germanized_pro()->plugin_path() . '/includes/libraries/tcpdf/tcpdf.php' );
}

use setasign\Fpdi\Tcpdf\Fpdi;

if ( ! class_exists( 'Fpdi' ) ) {
    require_once( WC_germanized_pro()->plugin_path() . '/includes/libraries/fpdi/src/autoload.php');
}

class WC_GZDP_PDF_Merger {

	private $files = array();

	public function __construct() {}

	public function add_pdf( $path, $pages = 'all', $nr = '' ) {
		if ( file_exists( $path ) ) {

			if( 'all' !== strtolower( $pages ) ) {
				$pages = $this->rewrite_pages( $pages );
			}
			
			$this->files[] = array( $path, $pages, $nr );
		}
	}
	
	public function merge( $outputmode = 'browser', $outputpath = 'newfile.pdf' ) {
		
		if ( empty( $this->files ) )
			return false;
		
		$fpdi = new Fpdi();
		$fpdi->setPrintHeader( false );
		$fpdi->setPrintFooter( false );

		//merger operations
		foreach( $this->files as $file ) {
			
			$filename  = $file[0];
			$filepages = $file[1];

			$count = $fpdi->setSourceFile( $filename );
			
			//add the pages
			if( 'all' === $filepages ) {
				for( $i = 1; $i <= $count; $i++ ) {
					
					$template 	= $fpdi->importPage( $i );
					$size 		= $fpdi->getTemplateSize( $template );
					$fpdi->AddPage( 'P', array( $size['width'], $size['height'] ), true, false );
					$fpdi->useTemplate( $template, 0, 0, 210, 297 );

					if ( $i == 1 ) {
						if ( isset( $file[2] ) && ! empty( $file[2] ) ) {
							$fpdi->SetFont('Arial', '', 9);
							$fpdi->setXY( 100, 5 );
							$fpdi->SetTextColor(29, 29, 27);
							$fpdi->SetFillColor(204, 204, 204);
							$fpdi->Cell( strlen( $file[2] ) * 3, 6, $file[2], 0, 0, "C", 1 );
						}	
					}
				}
			} else {
				foreach( $filepages as $page ) {
					if ( ! $template = $fpdi->importPage( $page ) ) {
					    return false;
                    }

					$size = $fpdi->getTemplateSize( $template );
					
					$fpdi->AddPage( 'P', array( $size['width'], $size['height'] ) );
					$fpdi->useTemplate( $template );
				}
			}
		}
		
		//output operations
		$mode = $this->switch_mode( $outputmode );
		
		if ( 'I' === $mode ) {
			$js = 'print(true);';
			$fpdi->IncludeJS( $js );
		}

		if ( 'S' === $mode ) {
			return $fpdi->Output( $outputpath, 'S' );
		} else {
			$fpdi->Output( $outputpath, $mode );
			return true;
		}
		
		return false;
	}
	
	private function switch_mode( $mode ) {
		switch( strtolower( $mode ) ) {
			case 'download':
				return 'D';
				break;
			case 'browser':
				return 'I';
				break;
			case 'file':
				return 'F';
				break;
			case 'string':
				return 'S';
				break;
			default:
				return 'I';
				break;
		}
	}
	
	private function rewrite_pages( $pages ) {
		$pages = str_replace( ' ', '', $pages );
		$part = explode( ',', $pages );
		
		foreach( $part as $i ) {
			$ind = explode( '-', $i );

			if( count( $ind ) == 2 ) {
				$x = $ind[0];
				$y = $ind[1];
				
				if( $x > $y )
					return false;
				
				//add middle pages
				while( $x <= $y ) {
					$newpages[] = (int) $x; 
					$x++;
				}
			} else {
				$newpages[] = (int) $ind[0];
			}
		}
		
		return $newpages;
	}
}

?>