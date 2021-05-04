import * as React from 'react';

import { actionCreators as initActions } from '../../Store/modules/init';
import { actionCreators as noticeActions } from '../../Store/modules/notice';

import { connect } from 'react-redux'; 
import { bindActionCreators } from 'redux'; 
import { StoreState } from '../../Store/modules';

import NoticeList from './notice.json';

export interface AllProps {
  initActions : any,
  noticeActions : any,
  large_cat : number,
  small_cat : number
};

class Notice extends React.Component<AllProps> {

  componentDidMount() {
    document.addEventListener('keydown', (event) => this._setKeyBoardKey(event))
  }

  componentWillUnmount() {
    document.removeEventListener("keydown", this._setKeyBoardKey);
  }

  _setKeyBoardKey = (event : any) => {
    const { noticeActions, large_cat, small_cat } = this.props;

    const keyCode : number = Number(event.keyCode);

    const save_obj : any = {}

    // 현재 카테고리
    const category : any = NoticeList[large_cat];
    
    if(keyCode === 40 ) {
      // 아래 키 && 오른쪽 키
      if( ( Object.keys(NoticeList).length - 1) > large_cat ) {

      if(category.child !== undefined) {
        if( (category.child.length - 1) > small_cat ) {
          save_obj['large_cat'] = large_cat;
          save_obj['small_cat'] = small_cat + 1;

        } else {
          save_obj['large_cat'] = large_cat + 1;
          save_obj['small_cat'] = 0;
        }

      } else {
        save_obj['large_cat'] = large_cat + 1;
        save_obj['small_cat'] = 0;
      }

    }

    } else if(keyCode === 38 ) {
      // 윗 키

      if(large_cat > 0) {
        if(category.child !== undefined) {

          if(small_cat > 0) {
            save_obj['large_cat'] = large_cat;
            save_obj['small_cat'] = small_cat - 1;

          } else if(small_cat === 0) {
            save_obj['large_cat'] = large_cat - 1;

            const cover_category : any = NoticeList[large_cat - 1];
            if(cover_category.child !== undefined) {
              save_obj['small_cat'] = cover_category.child.length - 1;
    
            } else {
              save_obj['small_cat'] = 0;
            }
          }
          
        } else {
          save_obj['large_cat'] = large_cat - 1;

          const cover_category : any = NoticeList[large_cat - 1];
          if(cover_category.child !== undefined) {
            save_obj['small_cat'] = cover_category.child.length - 1;

          } else {
            save_obj['small_cat'] = 0;
          }
        }
      }
    }

    noticeActions.select_tap(save_obj);
  }

  render() {
    const { large_cat, small_cat, noticeActions } = this.props;
    const large_comment = NoticeList[large_cat].comment;

    return(
      <div id='game_notice_div'>
        <div id='game_notice_category_div'> 
          {NoticeList.map( (list : any, key : number) => {
            return(
              <div key={key} className='game_notice_category_list'
              >
                <span
                   style={large_cat === key ? { 'color' : 'black' } : undefined}
                  onClick={() => noticeActions.select_tap({ 'large_cat' : key, 'small_cat' : 0 })}
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
                            onClick={() => noticeActions.select_tap({ 'large_cat' : key, 'small_cat' : key2 })}
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
          <div id='game_notice_thumbnail_div' />
          <div id='game_notice_comment_div' 
               dangerouslySetInnerHTML={{ __html : large_comment }}
          />
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
      noticeActions : bindActionCreators(noticeActions, dispatch)
  }) 
)(Notice);
