import * as React from 'react';

import { actionCreators as initActions } from '../../Store/modules/init';
import { actionCreators as functionsActions } from '../../Store/modules/functions';
import { actionCreators as noticeActions } from '../../Store/modules/notice';

import { connect } from 'react-redux'; 
import { bindActionCreators } from 'redux'; 
import { StoreState } from '../../Store/modules';

import NoticeList from './notice.json';

export interface AllProps {
  initActions : any,
  functionsActions : any,
  noticeActions : any,
  large_cat : number,
  small_cat : number
};

class Notice extends React.Component<AllProps> {

  componentDidMount() {
    const { functionsActions } = this.props;

    functionsActions.save_function({
      '_selectCategory' : this._selectCategory
    })

    window.document.addEventListener('keydown', (event) => this._closeKeyCode(event))
  }

  componentWillUnmount() {
    window.document.removeEventListener("keydown", (event) => this._closeKeyCode(event));
  }

  _closeKeyCode = (event : any) => {
    const { initActions } = this.props;
    const keyCode : number = event.keyCode;

    if(keyCode === 27) {
      // 닫기
      initActions.toggle_setting_modal({ 'modal' : false, 'type' : null })
    }
  }


  _selectCategory = (large : number, small : number) => {
    const { noticeActions } = this.props;

    noticeActions.select_tap({ 'large_cat' : large, 'small_cat' : small });

    const yScroll = Number(document.getElementById('large_list_' + large)?.offsetTop) - 300;
    
    const list : any = document.getElementById('game_notice_category_div');
    list?.scrollTo(0, yScroll)
  }

  render() {
    const { large_cat, small_cat } = this.props;
    const { _selectCategory } = this;

    let category : any = NoticeList[large_cat];
    if(category.child !== undefined) {
      category = category.child[small_cat];
    }

    const large_comment : string = category.comment;
    const thumb = category.thumbnail;

    let title = category.name;
    if(category.child !== undefined) {
      if(category.child.length > 0) {
        const small_category = category.child[small_cat];

        title += ' > ' + small_category.name;
      }
    }

    const style : any = { 'backgroundImage' : `url(${thumb})` };
    if(category.comment_show !== undefined) {
      style['height'] = '522px';
    }

    return(
      <div id='game_notice_div'>
        <div id='game_notice_category_div'> 
          {NoticeList.map( (list : any, key : number) => {
            return(
              <div key={key} className='game_notice_category_list'
                  id={'large_list_' + key}
              >
                <span
                   style={large_cat === key ? { 'color' : 'black' } : undefined}
                   onClick={() => _selectCategory(key, 0)}
                  // onClick={() => noticeActions.select_tap({ 'large_cat' : key, 'small_cat' : 0 })}
                > 
                  {list.name} 
                </span>

                {list.child !== undefined
                  ? 
                  <ul className='game_notice_ul'>
                    {list.child.map( ( el : any, key2 : number ) => {
                      return(
                        <li key={key2} className='game_notice_detail_list'
                            style={large_cat === key && small_cat === key2 ? { 'color' : 'black' } : undefined}
                        >
                          <b
                            onClick={() => _selectCategory(key, key2)}
                            // onClick={() => noticeActions.select_tap({ 'large_cat' : key, 'small_cat' : key2 })}
                          > 
                            {el.name} 
                          </b>
                        </li>
                      )
                    })}
                  </ul>

                  : undefined
                }
              </div>
            )
          })}
        </div>

        <div id='game_notice_contents_div'>
          <h2> {title} </h2>
          <div id='game_notice_thumbnail_div' 
               style={style}
          />
          {category.comment_show === undefined
            ?  <div id='game_notice_comment_div' 
                  dangerouslySetInnerHTML={{ __html : large_comment }}
              />
            : undefined
          }
        </div>
      </div>
    )
  }
}

export default connect( 
  ( { init, notice } : StoreState  ) => ({
    large_cat : notice.large_cat,
    small_cat : notice.small_cat
  }), 
    (dispatch) => ({ 
      initActions: bindActionCreators(initActions, dispatch),
      noticeActions : bindActionCreators(noticeActions, dispatch),
      functionsActions : bindActionCreators(functionsActions, dispatch)
  }) 
)(Notice);
