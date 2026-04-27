"""add match public visibility

Revision ID: 6fb0a2d4f7b1
Revises: 5b58f1d02fbd
Create Date: 2026-04-27 15:05:00.000000

"""
import sqlalchemy as sa
from alembic import op

# revision identifiers, used by Alembic.
revision = '6fb0a2d4f7b1'
down_revision = '5b58f1d02fbd'
branch_labels = None
depends_on = None


def upgrade():
    op.add_column(
        'match',
        sa.Column('is_public', sa.Boolean(), server_default=sa.true(), nullable=False),
    )
    op.alter_column('match', 'is_public', server_default=None)


def downgrade():
    op.drop_column('match', 'is_public')
