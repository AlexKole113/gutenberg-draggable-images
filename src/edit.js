import { Panel, PanelBody, PanelRow,  ColorPicker } from '@wordpress/components';
import { useBlockProps } from '@wordpress/block-editor';

import {NoticesControls} from "./components/NoticesControls";
import {NoticesDraggable} from "./components/NoticesDraggable";
import {DraggableScreen} from "./components/DraggableScreen";



const { MediaUpload, InspectorControls } = wp.blockEditor;
const {
	Fragment
} = wp.element;


import './editor.scss';
import {unitMap} from "./utils/unitMap";

export default function edit( props ) {
	const { notices, backgroundColor, containerHeight, containerWidth } = props.attributes;
	const { setAttributes, isSelected } = props;

	const addNotices = ( value ) => {
		notices.push({ url : value.sizes.full.url })
		setAttributes({
			...props.attributes,
			notices: [...notices]
		})
	}

	const deleteSingleNotice = (i) => {
		setAttributes({
			...props.attributes,
			notices: [...notices.filter( (item,j) => j !== i )]
		})
	}

	const changeImageSize = (e,i) => {
		notices[i]['size'] = e.target.value;
		setAttributes({
			...props.attributes,
			notices: [...notices]
		})
	}

	const changeZIndex = (e,i) => {
		notices[i]['zIndex'] = e.target.value
		setAttributes({
			...props.attributes,
			notices: [...notices]
		})
	}

	const changeBackgroundColor = (color) => {
		setAttributes({
			...props.attributes,
			backgroundColor: color
		})
	}

	const changeContainerHeight = (e) => {
		setAttributes({
			...props.attributes,
			containerHeight:  e.target.value
		})
	}

	const changeContainerWidth = (e) => {
		setAttributes({
			...props.attributes,
			containerWidth:  e.target.value
		})
	}



	const noticesCollectionWithControls  = notices.map((item, i) => (<NoticesControls
		key={i} url={item.url}
		clickHandler={ ()=>{deleteSingleNotice(i)} }
		changeSize={ (e)=>{changeImageSize(e,i)} }
		changeZIndex={(e)=>{changeZIndex(e,i)}}
		zIndex={item.zIndex}
		size={item.size} />)
	)

	const noticesCollectionWithDraggable = notices.map((item, i) => (<NoticesDraggable
		key={i}
		coordX={item.coordX}
		coordY={item.coordY}
		zIndex={item.zIndex}
		url={item.url}
		numberItem={i}
		size={item.size} />)
	)

	const blockGutenProps = useBlockProps();

	return (
		<Fragment>
			{ isSelected && (
				<InspectorControls>
					<Panel>
						<PanelBody title="Block Settings" initialOpen={ false }>
							<PanelRow>
								<ColorPicker
									color={ backgroundColor }
									onChangeComplete={ ( {hex} ) => { changeBackgroundColor(hex) } }
									disableAlpha
								/>
							</PanelRow>
							<PanelRow>
								<div style={{padding:'16px 16px 12px'}}>
									<span>Container height (px)</span>
									<input type="number" value={containerHeight} onChange={(e)=>{ changeContainerHeight(e) }}/>
								</div>
							</PanelRow>
							<PanelRow>
								<div style={{padding:'16px 16px 12px'}}>
									<span>Container width (px)</span>
									<input type="number" value={containerWidth} onChange={(e)=>{ changeContainerWidth(e) }}/>
								</div>
							</PanelRow>
						</PanelBody>
						<PanelBody title="Images Settings" initialOpen={ false } >
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
					</Panel>
				</InspectorControls>
			) }

			<section { ...blockGutenProps } style={{backgroundColor}} >
				<div style={{height: unitMap( containerHeight, 'containerHeight' ), width: unitMap( containerWidth,'containerWidth' ) }} className="container gutenberg-draggable-images__container">
					<DraggableScreen notices={notices} setItemsCoords={setAttributes} containerSizes={{containerHeight,containerWidth}} >
						{ noticesCollectionWithDraggable }
					</DraggableScreen>
				</div>
			</section>
		</Fragment>
	);
}
