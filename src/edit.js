
import { PanelBody, PanelRow, TextControl } from '@wordpress/components';
import { useBlockProps } from '@wordpress/block-editor';

import {NoticesControls} from "./components/NoticesControls";
import {NoticesDraggable} from "./components/NoticesDraggable";
import {DraggableScreen} from "./components/DraggableScreen";


const { MediaUpload, InspectorControls } = wp.blockEditor;
const {
	Fragment
} = wp.element;


import './editor.scss';

export default function Edit( props ) {
	const { imgUrl, notices } = props.attributes;
	const { className, setAttributes, isSelected } = props;

	const selectImage = (value) => {
		setAttributes({
			imgUrl: value.sizes.full.url,
		})
	}

	const addNotices = ( value ) => {
		notices.push({ url : value.sizes.full.url })
		setAttributes({
			notices: [...notices]
		})
	}

	const deleteSingleNotice = (i) => {
		setAttributes({
			notices: [...notices.filter( (item,j) => j !== i )]
		})
	}

	const changeSize = (e,i) => {
		console.log(e.target.value, i)
		notices[i]['size'] = e.target.value
		setAttributes({
			notices: [...notices]
		})
	}

	const changeZIndex = (e,i) => {
		notices[i]['zIndex'] = e.target.value
		setAttributes({
			notices: [...notices]
		})
	}

	const dragStop = ( e, data , i ) => {
		const { x, y } = data;
		notices[i]['coordX'] = x;
		notices[i]['coordY'] = y;
		setAttributes({
			notices: [...notices]
		})

	}


	const noticesCollectionWithControls  = notices.map((item, i) => (<NoticesControls
		key={i} url={item.url}
		clickHandler={ ()=>{deleteSingleNotice(i)} }
		changeSize={ (e)=>{changeSize(e,i)} }
		changeZIndex={(e)=>{changeZIndex(e,i)}}
		size={item.size} />)
	)

	const noticesCollectionWithDraggable = notices.map((item, i) => (<NoticesDraggable
		key={i}
		coordX={item.coordX}
		coordY={item.coordY}
		zIndex={item.zIndex}
		url={item.url}
		dragStop={ (e,d) =>{dragStop(e, d, i)}}
		size={item.size} />)
	)

	const blockGutenProps = useBlockProps();

	return (
		<Fragment>
			{ isSelected && (
				<InspectorControls>
					<PanelBody>
						<PanelRow>
							<MediaUpload
								onSelect={ (v)=>{ addNotices(v) }}
								render={ ({open}) => {
									return  <span className={`gutenberg-draggable-images__example-controls_add-img`} onClick={open} >add image</span>;
								}}
							/>
						</PanelRow>
						<PanelRow>
							<div style={{display:'flex', flexFlow:'column'}}>
								{ noticesCollectionWithControls }
							</div>
						</PanelRow>
					</PanelBody>
				</InspectorControls>
			) }

			<section { ...blockGutenProps }>
				<DraggableScreen>
					{ noticesCollectionWithDraggable }
				</DraggableScreen>
			</section>
		</Fragment>
	);
}
