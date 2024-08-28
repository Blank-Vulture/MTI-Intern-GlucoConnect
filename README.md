# team2-app
医者ー患者間でのSNSアプリケーション「GlucoConnect」のリポジトリです。
株式会社エムティーアイ（MTI）の2026年サマーインターンで作成。
## メンバー
|名前|役割|開発担当|
|:-:|:-:|:-:|
|芝　沙都希|アイデアの検証・整理|バックエンド|
|白石　鷹也|アイデア出し・全体進行|バックエンド寄り・フルスタック|
|TAKAOKA OKAZAKI MARIANA MIE|サポート|フロントエンド|
|原田　裕大|サポート|フロントエンド|

## DB設計
以下はテーブル一覧。

### Patient（患者）テーブル
TableName: GlucoConnectPatient

| カラム名        | データ型           | 説明                                                                 |
| --------------- | ------------------ | -------------------------------------------------------------------- |
| `user_id`       | `STRING`           | 患者を一意に識別するためのID (Partition Key)                          |
| `username`      | `STRING`           | 患者のユーザー名                                                      |
| `password`      | `STRING`           | ハッシュ化されたパスワード                                            |
| `doctor_map`    | `MAP`              | 担当医師の情報。key:`GlucoConnectDoctor.user_id`, value:`GlucoConnectDoctor.username`|

### Doctor（医師）テーブル
TableName: GlucoConnectDoctor

| カラム名        | データ型           | 説明                                                                  |
| --------------- | ------------------ | --------------------------------------------------------------------- |
| `user_id`       | `STRING`           | 医師を一意に識別するためのID (Partition Key)                           |
| `username`      | `STRING`           | 医師のユーザー名                                                       |
| `password`      | `STRING`           | ハッシュ化されたパスワード                                             |
| `patient_map`   | `MAP`              | 担当患者の情報。key:`GlucoConnectPatient.user_id`, value:`GlucoConnectPatient.username`|
| `category`      | `STRING`           | 医師の専門分野（例: 内科、糖尿病専門医など）  ソートキー              |

### Articles（投稿）テーブル
TableName: GlucoConnectArticles

| カラム名            | データ型           | 説明                                                                |
| ------------------- | ------------------ | ------------------------------------------------------------------- |
| `user_id`           | `STRING`           | 投稿者（患者）のユーザーID (Partition Key)                           |
| `created_at`        | `NUMBER`           | 投稿が作成された日時 (Sort Key)。                                    |
| `post_type`         | `STRING`           | 投稿の種類（診察・日常記録:`note`, 薬の相性記録:`medicine`, 食事記録:`meal`）|
| `content`           | `STRING`           | 診察記録やメモなどの投稿内容                                         |
| `medicine_score`    | `NUMBER`           | 薬の相性値（`post_type`が薬の相性記録`medicine`の場合に使用）        |
| `picture`       　　| `STRING`           | 主には食事記録画像のURL 　　　　　　　　　　　　　　　　　　　　　　|
| `special`           | `STRING`           | 特記事項。薬の名前など                                              |

### Hba1c_Records（HbA1c記録）テーブル
TableName: GlucoConnectHba1c_Records

| カラム名       | データ型         | 説明                                     |
| -------------- | ---------------- | ---------------------------------------- |
| `user_id`      | `STRING`         | 記録を持つ患者のユーザーID（Partition Key）|
| `recorded_at`  | `NUMBER`         | HbA1cが測定された日時（Sort Key）         |
| `hba1c_value`  | `NUMBER`         | 測定されたHbA1cの値                      |

- **GlucoConnectArticles**: `medicine_score`が`0`の投稿は`post_type`が`note`だった時と同じ扱い
- **GlucoConnectArticles**, **GlucoConnectHba1c_Records**: unixtimeをNumber型にしたことで空白でエラーが発生する。ただし、直接参照可能。
