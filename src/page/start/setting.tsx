import * as React from 'react';

import { actionCreators as initActions } from '../../Store/modules/init';
import { actionCreators as gameActions } from '../../Store/modules/game';

import { connect } from 'react-redux'; 
import { bindActionCreators } from 'redux'; 
import { StoreState } from '../../Store/modules';

import init_player from '../../source/player.json';

export interface AllProps {
  initActions : any,
  gameActions : any,
  setting_stage : number,
  start_price : number,
  round_timer : number,
  game_event : boolean,
  setting_modify : boolean,
  round_limit : number,
  pass_price : number,
  player_list : string,
  able_player : number,
  card_limit : number,
  select_character : boolean,
  select_info : string,
  select_character_list : string,
  _flash : Function,
  setting_able : boolean
};

class Setting extends React.Component<AllProps> {

    componentDidMount() {
        // 초기 플레이어 설정하기
        const { initActions } = this.props;
        const player_list = JSON.parse(this.props.player_list);

        const save_obj : any = {};

        if(player_list.length === 0) {
            save_obj['player_list'] = JSON.stringify(init_player.list);
        }
            // "캐릭터 번호" : "플레이어 ID"
            const select_character_obj = {
                "1" : 1,
                "2" : 2,
                "3" : false,
                "4" : false
            };

        save_obj['select_character_list'] = JSON.stringify(select_character_obj);

        initActions.set_player_info(save_obj)
    }

    _moveStage = (stage : number) => {
        const { initActions, setting_stage, setting_able } = this.props;
        const player_list = JSON.parse(this.props.player_list)

        if(setting_able === true) {
            if(setting_stage === 2) {
                for(let i = 0; i < player_list.length; i++) {
                    player_list[i].select = false;
                }

                initActions.set_player_info({
                    'select_character' : false,
                    'select_info' : JSON.stringify({}),
                    'player_list' : JSON.stringify(player_list)
                })
            }
            

            initActions.set_setting_state({ 'stage' : stage });
        }
    }

    _setGameInfo = (event : any, type : string, bool : boolean | number | null) => {
        const { initActions } = this.props;
        let value : any = event.target.value

        if(type === 'start_price' || type === 'round_timer' || type === 'round_limit') {
            value = Number(value);

        } else if(type === 'game_event' || type === 'card_limit') {
            value = bool;
        }

        const save_obj : any = {};
        save_obj[type] = value;
        save_obj['modify'] = true;

        return initActions.set_setting_state(save_obj);
    }

    _resetSetting = () => {
        if(window.confirm('설정한 부분들을 모두 초기화 하시겠습니까?')) {
            const { initActions } = this.props;

            const save_obj : any = {}
            save_obj['start_price'] = 100;
            save_obj['round_timer'] = 60;
            save_obj['round_limit'] = 0;
            save_obj['game_event'] = true;
            save_obj['modify'] = false;
            save_obj['pass_price'] = 1;
            save_obj['card_limit'] = 1;

            return initActions.set_setting_state(save_obj);

        } else {
            return;
        }
    }

    // 안내문 띄우기
    _setNotice = (event : any | null, on : boolean, notice : string) => {
        let target = event.target.parentNode.parentNode;

        let html : any = `<div id="notice_div"> ${notice} </div>`
        html = new DOMParser().parseFromString(html, "text/html");
        html = html.documentElement.innerHTML;

        if(on) {
            target.append(document.createElement('div'));
            target = target.childNodes[target.childNodes.length - 1];

            target.innerHTML = html;
        
        } else if(on === false) {
            target = document.getElementById('notice_div');
            target.remove();
        }
    }

    // 플레이어 추가 / 삭제하기
    _setPlayerList = (event : any, info : object | any, type : string) => {
        let target = event.target;
        const { initActions } = this.props;
        const player_list = JSON.parse(this.props.player_list);

        const icon : any = require('../../source/icon.json');

        const save_obj : any = {}

        if(info["able"] === false) {
            if(type === 'on') {
                target.style.backgroundImage = `url(${icon.icon.plus})`;

            } else if(type === 'off') {
                target.style.backgroundImage = `url(${null})`;
            }
        }

        if(type === 'click') {
            let info_number = info.number - 1;

            if(player_list[info.number - 1]['select'] === false) {
                if(info.number === 4) {
                    // 4 플레이어 선택시, 3 플레이어가 활성화 되어 있는지 체크
                    if(player_list[2]['able'] === false) {
                        info_number = info.number - 2;
                        info = player_list[info_number];
                    }
                }

                player_list.forEach( (el : any) => {
                    player_list[el.number - 1]['select'] = false;
                })
                player_list[info_number]['select'] = true;

                save_obj['select_character'] = true;
                save_obj['select_info'] = JSON.stringify(info);

            } else {
                // 클릭 취소하기
                player_list[info_number]['select'] = false;
                save_obj['select_character'] = false;

                save_obj['select_info'] = JSON.stringify({});
            }   
        }

        save_obj['player_list'] = JSON.stringify(player_list)
        return initActions.set_player_info(save_obj)

        // initActions.set_player_info({ 'player_list' : JSON.stringify(player_list) })
    }

    // 캐릭터 선택하기
    _selectCharacter = (type : string, value : number) => {
        const { initActions } = this.props;
        const player_list : any = JSON.parse(this.props.player_list);

        const select_info : any = JSON.parse(this.props.select_info);
        const select_character_list : any = JSON.parse(this.props.select_character_list);

        const save_obj : any = {};

        if(type === 'remove') {
            const select_character = player_list[select_info.number - 1]['character'];

            if(select_info.number === 1 || select_info.number === 2) {
                return alert('[ 나 ] 또는 [ 플레이어 2 ] 는 삭제 대상이 아닙니다.');

            } else if(select_info['able'] === false) {
                return alert('선택된 캐릭터가 없습니다.')

            } else if(select_info.number === 3) {
                if(player_list[3]['able'] === true) {
                    alert(' [ 플레이어 4 ] 를 우선 삭제해주세요. ');

                    player_list[2]['select'] = false;
                    player_list[3]['select'] = true;

                    return initActions.set_player_info({
                        'select_info' : JSON.stringify(player_list[3]),
                        'player_list' : JSON.stringify(player_list)
                    })
                }
            } 

            player_list[select_info.number - 1]['able'] = false;
            player_list[select_info.number - 1]['character'] = 0;
            
            select_character_list[select_character] = false;
            save_obj['able_player'] = this.props.able_player - 1;


        } else if(type === 'character') {
            let overlap_check = false;
            // 중복 체크하기

            // 기존 (변경 전)의 캐릭터 저장하기
            const origin_charater = select_info.character;

            // 기존의 캐릭터를 가지고 있던 플레이어 ID 저장
            const origin_player = select_character_list[value];

            if(player_list[select_info.number - 1]['able'] === false) {
                player_list[select_info.number - 1]['able'] = true;
                save_obj['able_player'] = this.props.able_player + 1;
            }

            if(select_character_list[value] !== false) {
                overlap_check = true;
            }

            player_list[select_info.number - 1]['character'] = value;

            select_character_list[value] = select_info['number'];
            select_character_list[select_info.character] = false;

            // 중복 체크하기 (바꾸기)
            if(overlap_check === true) {
                if(origin_charater !== 0) {
                    // 선택한 캐릭터를 다른 플레이어가 사용중일 경우 서로 바꾼다.
                    select_character_list[origin_charater] = origin_player;
                    player_list[origin_player - 1]['character'] = origin_charater;

                } else {
                    // 새로 고른 캐릭터가 중복될 경우에는
                    // 선택되지 않는 캐릭터를 찾아서 설정해준다.
                    for(const key in select_character_list) {
                        const idx : number = Number(key);

                        if(idx > 0) {
                            if(select_character_list[key] === false) {

                                select_character_list[idx] = origin_player;
                                player_list[origin_player - 1]['character'] = idx;

                                break;
                            }
                        }
                    }
                }
            }
        }

        save_obj['player_list'] = JSON.stringify(player_list);
        save_obj['select_character_list'] = JSON.stringify(select_character_list);
        save_obj['select_info'] = JSON.stringify(player_list[select_info.number - 1]);

        return initActions.set_player_info(save_obj)
    }

    // 게임 시작하기
    _gameStart = () => {
        const { _flash, initActions, gameActions } = this.props;

        initActions.toggle_setting_modal({ 'able' : false });
        gameActions.game_loading({ 'loading' : true })

        return window.setTimeout( () => {
            _flash('.ReactModal__Content', false, 1.4, false, 40);

            return window.setTimeout( () => {
                initActions.toggle_setting_modal({ 'modal' : false });
            }, 500)

        }, 200)
    }

    render() {
        const { 
            setting_stage, setting_modify, able_player, select_character, setting_able
        } = this.props;
        const { _moveStage, _setGameInfo, _resetSetting, _setNotice, _setPlayerList, _selectCharacter, _gameStart } = this;

        const player_list : any = JSON.parse(this.props.player_list);
        const select_info : any = JSON.parse(this.props.select_info);
        const select_character_list : any = JSON.parse(this.props.select_character_list);
        const setting_opt_arr = ['1. 게임 설정', '2. 플레이어 설정', '3. 게임 시작'];

        const icon : any = require('../../source/icon.json');
        const setting_json : any = require('./setting.json');

        return(
        <div id='game_setting_div'>
            <div id='game_setting_state_div'>

                {setting_opt_arr.map( (el, key) => {
                    let class_name = '';

                    if(key === 1) {
                        class_name = 'aCenter';

                    } else if(key === 2) {
                        class_name = 'aRight';
                    }

                    return(
                        <div key={key} className={class_name}>
                            <b className={setting_stage === (key + 1) ? 'black' : undefined}
                                onClick={() => _moveStage(key + 1)}
                                id={setting_stage === (key + 1) ? 'select_setting_option' : undefined}
                            >
                                {el}
                            </b>
                        </div>
                    )
                })}
            </div>
            
            <div id='game_setting_contents_div'>

                <div id='game_setting_contents'>
                    <div className='game_setting_arrow_divs'>
                        {setting_stage !== 1
                            ? <img alt='' id='game_setting_move_prev_page_icon' 
                                className='game_setting_move_arrows'
                                src={setting_stage > 1 ? icon.icon.left_arrow : icon.icon.left_gray_arrow}
                                onClick={() => setting_stage >= 2 ? _moveStage(setting_stage - 1) : undefined}
                            />

                            : undefined
                        }
                    </div>

                    {setting_stage === 1
                        ? <div id='game_info_setting_div'>
                            <ul>
                                {setting_json.setting.map( (el : any, key : number) => {
                                    const props : any = this.props;

                                    return(
                                        <li key={key}>
                                            <div className='game_setting_title_div'>
                                                {el.name}

                                                {el.type === 'radio'
                                                    ?   <img src={icon.icon.notice} className='notice_icon' alt=''
                                                            onMouseEnter={(event) => _setNotice(event, true, el.notice)}
                                                            onMouseLeave={(event) => _setNotice(event, false, el.notice)}
                                                        />

                                                    : undefined
                                                }
                                            </div>

                                            <div className='game_setting_info_div'>
                                                {el.type === 'select'
                                                    ? <div>
                                                        <select value={props[el.state]}
                                                            onChange={(event : any) => _setGameInfo(event, el.state, null)}
                                                        >
                                                            {el.type_info.map( (cu : any, key_2 : number) => {
                                                                return(
                                                                    <option key={key_2} value={cu.value}>
                                                                        {cu.name}
                                                                    </option>
                                                                )
                                                            })}

                                                        </select>

                                                        {el.type === 'select'
                                                            ?   <img src={icon.icon.notice} className='notice_icon' alt=''
                                                                    onMouseEnter={(event) => _setNotice(event, true, el.notice)}
                                                                    onMouseLeave={(event) => _setNotice(event, false, el.notice)}
                                                                />

                                                            : undefined
                                                        }
                                                      </div>


                                                : el.type === 'radio'

                                                    ? <div className='game_setting_radio_div'>
                                                        {el.type_info.map( (cu : any, key_2 : number) => {
                                                            const checked_info = props[el.state];

                                                            return(
                                                                <div key={key_2}>
                                                                    <input type='radio' name={el.state} className='setting_radio' id={cu.id} 
                                                                            onChange={(event : any) => _setGameInfo(event, el.state, cu.value)}
                                                                            checked={checked_info === cu.value}
                                                                    />
                                                                    <label htmlFor={cu.id}> {cu.name} </label>
                                                                </div>
                                                            )
                                                        })}
                                                      </div>

                                                    : undefined
                                                }
                                            </div>
                                        </li>
                                    )
                                })}
                            </ul>

                            <div id='game_setting_complate_div' className='aRight'>
                                <div className='game_setting_next_game_div'>
                                    <input type='button' value='플레이어 설정　>>' 
                                        className='game_setting_button_style'
                                        onClick={() => _moveStage(2)}
                                    />
                                </div>

                                <div> 
                                    <input type='button' value='초기화' title='설정들을 기본 설정으로 바꿉니다.' 
                                            className='game_setting_button_style'
                                            id='game_setting_reset_button' onClick={() => setting_modify === true ? _resetSetting() : undefined}
                                            style={setting_modify === false ? { 'backgroundColor' : '#ababab', 'color' : 'white' } : undefined}
                                    /> 
                                </div>
                            </div>
                        </div>
                        
                        : setting_stage === 2

                        ? <div id='game_setting_player_div'>
                            <p id='game_playing_player_number'> 게임 플레이어 : {able_player} / 4 </p>

                            <div id='game_player_select_div'>
                                {player_list.map( (el : any, key : number) => {

                                    let profile_img : object | string = '';
                                    let title_ment : undefined | string = undefined;

                                    let img_size = '40%';
                                    let img_higher = 'center';

                                    if(el.plus === false) {
                                        title_ment = '클릭해서 플레이어 추가';

                                        if(select_info.number === el.number) {
                                            title_ment = '선택창 닫기'
                                        }
                                    }

                                    if(el.select === true) {
                                        profile_img = icon.icon.plus_black
                                    }

                                    if(el.able === true) {
                                        profile_img = icon.img.character.action[el.character];
                                        img_size = '80%';
                                        img_higher = '30%';
                                    }

                                    let check_disable = false;
                                    if(el.number === 4) {
                                        if(player_list[2]['able'] === false) {
                                            check_disable = true;
                                            title_ment = '3 플레이어부터 설정해주세요.'
                                        }
                                        // if(player_list[2])
                                    }

                                    return(
                                        <div key={key} className='game_player_select_divs'
                                            style={el.able === false ? { 'color' : '#ababab' } : undefined}
                                            id={select_info.number === (key + 1) ? "game_player_selector" : undefined}
                                        >
                                            {el.number === 1 || el.number === 2
                                                ? <img 
                                                    src={icon.icon.fix}
                                                    alt=''
                                                    className='game_player_fix_icon'
                                                    title='삭제할 수 없는 필수 플레이어 입니다.'
                                                  />

                                                : undefined
                                            }

                                            <div className='game_player_profile_div'
                                                 onMouseEnter={(event) => el.select === false ? _setPlayerList(event, el, 'on') : undefined}
                                                 onMouseLeave={(event) => el.select === false ? _setPlayerList(event, el, 'off') : undefined}
                                                 onClick={(event) => _setPlayerList(event, el, 'click')}
                                                 style={{ 'backgroundImage' : `url(${profile_img})`, 'backgroundSize' : img_size, 'backgroundPositionY' : img_higher }}
                                                 title={title_ment}
                                                 id={check_disable === true ? 'game_select_disable' : undefined}
                                            />
                                            <div className='game_player_name_div'>
                                                {el.name}
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>

                            {select_character === true
                                ? <div id='game_select_player_character_div'>
                                    <p id='game_select_player_character_title'> 캐릭터 선택 </p>

                                    <div id='game_select_player_character_contents_div'>
                                        {init_player.select_list.map( (el : any, key : number) => {

                                            let img : any = '';
                                            if(el.type === 'remove') {
                                                img = icon.icon.close_gray;

                                                if(select_info.able === true) {
                                                    if(select_info.number !== 1 && select_info.number !== 2) {
                                                        img = icon.icon.close_red;
                                                    }
                                                }

                                            } else if(el.type === 'character') {
                                                img = icon.img.character.stop[el.number];
                                            }

                                            let color_condition : boolean = false; 
                                            if(el.type === 'remove') {
                                                // 삭제 아이콘
                                                if(select_info.able === false) {
                                                    color_condition = true;

                                                } else {
                                                    if(select_info.number === 1 || select_info.number === 2) {
                                                        color_condition = true;
                                                    }
                                                }
                                            }

                                            let select_condition : boolean = false;
                                            if(select_info.able === true) {
                                                if(select_info.character === el.number) {
                                                    select_condition = true;
                                                }
                                            }

                                            let name : string = el.name;

                                            return(
                                                <div key={key}
                                                     id={select_condition === true ? 'select_player_character' : undefined}
                                                     onClick={() => _selectCharacter(el.type, el.number)}
                                                     style={select_character_list[key] === true ? { 'color' : "#ababab" } : undefined}
                                                >
                                                    {select_condition === true
                                                        ? <img alt='' id='select_player_character_point_icon' 
                                                            src={icon.icon.point}
                                                        />

                                                        : null
                                                    }   

                                                    <img 
                                                        id={el.type === 'remove' ? 'game_select_remove_character_icon' : undefined}
                                                        src={img}
                                                        alt=''
                                                    />
                                                    <p className={color_condition === true ? 'gray' : undefined}> 
                                                        {name} 
                                                    </p>
                                                </div>
                                            )
                                        })}
                                    </div>
                                  </div>

                                : undefined
                            }

                            <div id='game_character_select_start_div'>
                                <div> 
                                    <input type='button' value='<<　게임 설정'
                                        className='game_setting_button_style'
                                        onClick={() => _moveStage(1)}
                                    />
                                </div>

                                <div className='aRight'>
                                    <input type='button' value='게임 시작　>>'
                                        className='game_setting_button_style'
                                        onClick={() => _moveStage(3)}
                                    />
                                </div>
                            </div>
                          </div>

                        : setting_stage === 3

                        ? <div id='game_setting_start_div'>

                            <div className='game_setting_result_divs'>
                                <p onClick={() => _moveStage(1)}> 
                                    게임 설정 
                                    <img alt='' src={icon.icon.modify} title='[ 게임 설정 ] 탭으로 이동' /> 
                                </p>

                                <div id='game_setting_result_div' className='game_setting_result_border'>
                                    {setting_json.setting.map( (el : any, key : number) => {
                                        const props : any = this.props;
                                        let values : any = props[el.state];

                                        let contents : string = values + el.type_name;
                                        if(el.state === 'round_timer') {
                                            if(values === 0) {
                                                contents = '시간 제한 없음';
                                            }

                                        } else if(el.state === 'round_limit') {
                                            if(values === 0) {
                                                contents = '제한 없음';
                                            }

                                        } else if(el.state === 'game_event') {
                                            if(values === true) {
                                                contents = 'ON';
                                            } else {
                                                contents = 'OFF';
                                            }
                                        }

                                        let change : string = '';
                                        if(values !== el.default) {
                                            change = '( 변경 )'
                                        }

                                        return(
                                            <div key={key} className='game_setting_result_grid_div'>
                                                <div className='game_setting_result_title_div'> {el.name} </div>
                                                <div className='game_setting_result_contents_div'>
                                                    {contents}　{change}
                                                </div>
                                            </div>
                                        )
                                    })}
                                </div>
                            </div>

                            <div className='game_setting_result_divs'>
                                <p onClick={() => _moveStage(2)}> 
                                    플레이어 설정 ( {able_player} / 4 ) 
                                    <img alt='' src={icon.icon.modify} title='[ 플레이어 설정 ] 탭으로 이동' />
                                </p>

                                <div id='game_player_setting_result_div' className='game_setting_result_border'>
                                    {player_list.map( (el : any, key : number) => {
                                        let img : string = '';

                                        let style_col : any = {};

                                        if(el.able === true) {
                                            img = icon.img.character.stop[el.character];

                                        } else {
                                            style_col['backgroundColor'] = '#bbbbbb';
                                            style_col['minHeight'] = '128px';
                                        }

                                        return(
                                            <div className='game_setting_character_result_div' key={key}>
                                                <div
                                                    style={style_col}
                                                    // style={el.able === false ? { 'backgroundColor' : '#bbbbbb' } : undefined}
                                                >
                                                    <img alt='' src={img} />
                                                </div>

                                                {el.able === true
                                                    ? <p> {el.name} </p>
                                                    : undefined
                                                }

                                            </div>
                                        )
                                    })}
                                </div>
                            </div>

                            <input type='button' id='game_start_button'
                                    className='pointer'
                                    value='게임 시작' onClick={setting_able === true ? _gameStart : undefined}
                            />
                          </div>

                        : undefined
                    }

                    <div className='game_setting_arrow_divs aRight'>
                        {setting_stage !== 3
                            ? <img alt='' id='game_setting_move_next_page_icon' 
                                className='game_setting_move_arrows'
                                src={setting_stage !== 3 ? icon.icon.right_arrow : icon.icon.right_gray_arrow}
                                onClick={() => setting_stage !== 3 ? _moveStage(setting_stage + 1) : undefined}
                            />

                            : undefined
                        }
                    </div>
                </div>
            </div>
        </div>
        )
    }
    }

    export default connect( 
    ( { init } : StoreState  ) => ({
        setting_stage : init.setting_stage,
        start_price : init.start_price,
        round_timer : init.round_timer,
        game_event : init.game_event,
        setting_modify : init.setting_modify,
        round_limit : init.round_limit,
        pass_price : init.pass_price,
        player_list : init.player_list,
        able_player : init.able_player,
        card_limit : init.card_limit,
        select_character : init.select_character,
        select_info : init.select_info,
        select_character_list : init.select_character_list,
        setting_able : init.setting_able
    }), 
        (dispatch) => ({ 
        initActions: bindActionCreators(initActions, dispatch),
        gameActions: bindActionCreators(gameActions, dispatch)
    }) 
    )(Setting);
